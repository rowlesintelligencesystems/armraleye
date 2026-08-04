/**
 * Area 44 Audit Persistence (encrypted at rest)
 *
 * Stores Zero Trust policy decision audit events in Workers KV.
 * When AUDIT_ENCRYPTION_KEY is set, events are encrypted with AES-256-GCM.
 * Bounded log: keeps the most recent MAX_EVENTS entries.
 */

import {
	decryptAuditPayload,
	encryptAuditPayload,
	importAuditKey,
	isEncryptedBlob,
} from "./audit-crypto";
import type { AuditEvent } from "./zero-trust";

const AUDIT_INDEX_KEY = "area44:audit:index";
const AUDIT_EVENT_PREFIX = "area44:audit:event:";
const MAX_EVENTS = 500;
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

export interface AuditStoreEnv {
	VISIBILITY_CACHE: KVNamespace;
	/** Base64-encoded 32-byte AES key. Set via: wrangler secret put AUDIT_ENCRYPTION_KEY */
	AUDIT_ENCRYPTION_KEY?: string;
}

async function getCryptoKey(
	env: AuditStoreEnv,
): Promise<CryptoKey | null> {
	if (!env.AUDIT_ENCRYPTION_KEY) return null;
	return importAuditKey(env.AUDIT_ENCRYPTION_KEY);
}

/** Persist a single audit event (encrypted when key is present) and update the index. */
export async function persistAuditEvent(
	env: AuditStoreEnv,
	event: AuditEvent,
): Promise<void> {
	const eventKey = `${AUDIT_EVENT_PREFIX}${event.id}`;
	const plaintext = JSON.stringify(event);

	const key = await getCryptoKey(env);
	let stored: string;

	if (key) {
		const blob = await encryptAuditPayload(key, plaintext);
		stored = JSON.stringify(blob);
	} else {
		// Encryption key not configured — store plaintext (dev / migration mode)
		console.warn(
			"[Area44] AUDIT_ENCRYPTION_KEY not set; storing audit event in plaintext",
		);
		stored = plaintext;
	}

	await env.VISIBILITY_CACHE.put(eventKey, stored, {
		expirationTtl: EVENT_TTL_SECONDS,
	});

	// Update the index (most-recent-first) — index stays plaintext (ids only)
	const rawIndex = await env.VISIBILITY_CACHE.get(AUDIT_INDEX_KEY, "json");
	let index: string[] = Array.isArray(rawIndex) ? (rawIndex as string[]) : [];

	index = [event.id, ...index.filter((id) => id !== event.id)].slice(
		0,
		MAX_EVENTS,
	);

	await env.VISIBILITY_CACHE.put(AUDIT_INDEX_KEY, JSON.stringify(index), {
		expirationTtl: EVENT_TTL_SECONDS,
	});
}

/** Retrieve and decrypt a single audit event by id. */
export async function getAuditEvent(
	env: AuditStoreEnv,
	id: string,
): Promise<AuditEvent | null> {
	const raw = await env.VISIBILITY_CACHE.get(
		`${AUDIT_EVENT_PREFIX}${id}`,
		"json",
	);
	if (!raw || typeof raw !== "object") return null;

	// Encrypted blob path
	if (isEncryptedBlob(raw)) {
		const key = await getCryptoKey(env);
		if (!key) {
			console.error(
				"[Area44] Encrypted audit event found but AUDIT_ENCRYPTION_KEY is missing",
			);
			return null;
		}
		try {
			const plaintext = await decryptAuditPayload(key, raw);
			return JSON.parse(plaintext) as AuditEvent;
		} catch (err) {
			console.error(
				"[Area44] Failed to decrypt audit event:",
				(err as Error).message,
			);
			return null;
		}
	}

	// Legacy plaintext event (pre-encryption)
	return raw as AuditEvent;
}

/** List recent audit events (most recent first). */
export async function listAuditEvents(
	env: AuditStoreEnv,
	opts?: { limit?: number; offset?: number },
): Promise<{ count: number; events: AuditEvent[]; encrypted: boolean }> {
	const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 100);
	const offset = Math.max(opts?.offset ?? 0, 0);

	const rawIndex = await env.VISIBILITY_CACHE.get(AUDIT_INDEX_KEY, "json");
	const index: string[] = Array.isArray(rawIndex) ? (rawIndex as string[]) : [];

	const slice = index.slice(offset, offset + limit);
	const events: AuditEvent[] = [];

	const results = await Promise.all(slice.map((id) => getAuditEvent(env, id)));

	for (const ev of results) {
		if (ev) events.push(ev);
	}

	return {
		count: events.length,
		events,
		encrypted: Boolean(env.AUDIT_ENCRYPTION_KEY),
	};
}

/** Return basic audit log stats. */
export async function getAuditStats(env: AuditStoreEnv): Promise<{
	totalIndexed: number;
	maxEvents: number;
	ttlDays: number;
	encryptionEnabled: boolean;
}> {
	const rawIndex = await env.VISIBILITY_CACHE.get(AUDIT_INDEX_KEY, "json");
	const index: string[] = Array.isArray(rawIndex) ? (rawIndex as string[]) : [];
	return {
		totalIndexed: index.length,
		maxEvents: MAX_EVENTS,
		ttlDays: EVENT_TTL_SECONDS / (60 * 60 * 24),
		encryptionEnabled: Boolean(env.AUDIT_ENCRYPTION_KEY),
	};
}
