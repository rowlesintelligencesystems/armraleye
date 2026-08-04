/**
 * Area 44 Audit Persistence
 *
 * Stores Zero Trust policy decision audit events in Workers KV.
 * Bounded log: keeps the most recent MAX_EVENTS entries.
 */

import type { AuditEvent } from "./zero-trust";

const AUDIT_INDEX_KEY = "area44:audit:index";
const AUDIT_EVENT_PREFIX = "area44:audit:event:";
const MAX_EVENTS = 500;
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

export interface AuditStoreEnv {
	VISIBILITY_CACHE: KVNamespace;
}

/** Persist a single audit event and update the index. */
export async function persistAuditEvent(
	env: AuditStoreEnv,
	event: AuditEvent,
): Promise<void> {
	const eventKey = `${AUDIT_EVENT_PREFIX}${event.id}`;

	// Store the event
	await env.VISIBILITY_CACHE.put(eventKey, JSON.stringify(event), {
		expirationTtl: EVENT_TTL_SECONDS,
	});

	// Update the index (most-recent-first)
	const rawIndex = await env.VISIBILITY_CACHE.get(AUDIT_INDEX_KEY, "json");
	let index: string[] = Array.isArray(rawIndex) ? (rawIndex as string[]) : [];

	// Prepend new id, dedupe, trim
	index = [event.id, ...index.filter((id) => id !== event.id)].slice(
		0,
		MAX_EVENTS,
	);

	await env.VISIBILITY_CACHE.put(AUDIT_INDEX_KEY, JSON.stringify(index), {
		expirationTtl: EVENT_TTL_SECONDS,
	});
}

/** Retrieve a single audit event by id. */
export async function getAuditEvent(
	env: AuditStoreEnv,
	id: string,
): Promise<AuditEvent | null> {
	const raw = await env.VISIBILITY_CACHE.get(
		`${AUDIT_EVENT_PREFIX}${id}`,
		"json",
	);
	if (!raw || typeof raw !== "object") return null;
	return raw as AuditEvent;
}

/** List recent audit events (most recent first). */
export async function listAuditEvents(
	env: AuditStoreEnv,
	opts?: { limit?: number; offset?: number },
): Promise<{ count: number; events: AuditEvent[] }> {
	const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 100);
	const offset = Math.max(opts?.offset ?? 0, 0);

	const rawIndex = await env.VISIBILITY_CACHE.get(AUDIT_INDEX_KEY, "json");
	const index: string[] = Array.isArray(rawIndex) ? (rawIndex as string[]) : [];

	const slice = index.slice(offset, offset + limit);
	const events: AuditEvent[] = [];

	// Fetch in parallel
	const results = await Promise.all(
		slice.map((id) => getAuditEvent(env, id)),
	);

	for (const ev of results) {
		if (ev) events.push(ev);
	}

	return { count: events.length, events };
}

/** Return basic audit log stats. */
export async function getAuditStats(
	env: AuditStoreEnv,
): Promise<{ totalIndexed: number; maxEvents: number; ttlDays: number }> {
	const rawIndex = await env.VISIBILITY_CACHE.get(AUDIT_INDEX_KEY, "json");
	const index: string[] = Array.isArray(rawIndex) ? (rawIndex as string[]) : [];
	return {
		totalIndexed: index.length,
		maxEvents: MAX_EVENTS,
		ttlDays: EVENT_TTL_SECONDS / (60 * 60 * 24),
	};
}
