/**
 * Audit log encryption for Area 44.
 *
 * AES-256-GCM via Web Crypto. Key is provided as a Worker secret
 * (AUDIT_ENCRYPTION_KEY) — 32-byte key, base64-encoded.
 *
 * Stored format (JSON):
 * {
 *   v: 1,
 *   iv: <base64>,
 *   ct: <base64 ciphertext+tag>
 * }
 */

const VERSION = 1;
const ALGO = "AES-GCM";
const IV_BYTES = 12;

export interface EncryptedBlob {
	v: number;
	iv: string;
	ct: string;
}

function b64Encode(buf: ArrayBuffer | Uint8Array): string {
	const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
	let s = "";
	for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
	return btoa(s);
}

function b64Decode(s: string): Uint8Array {
	const bin = atob(s);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

/** Import a base64-encoded 32-byte key for AES-GCM. */
export async function importAuditKey(keyB64: string): Promise<CryptoKey> {
	const raw = b64Decode(keyB64);
	if (raw.byteLength !== 32) {
		throw new Error(
			`AUDIT_ENCRYPTION_KEY must decode to 32 bytes (got ${raw.byteLength})`,
		);
	}
	return crypto.subtle.importKey("raw", raw, { name: ALGO }, false, [
		"encrypt",
		"decrypt",
	]);
}

/** Encrypt a UTF-8 string payload. Returns a JSON-serializable blob. */
export async function encryptAuditPayload(
	key: CryptoKey,
	plaintext: string,
): Promise<EncryptedBlob> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
	const encoded = new TextEncoder().encode(plaintext);
	const ciphertext = await crypto.subtle.encrypt(
		{ name: ALGO, iv },
		key,
		encoded,
	);
	return {
		v: VERSION,
		iv: b64Encode(iv),
		ct: b64Encode(ciphertext),
	};
}

/** Decrypt an EncryptedBlob back to a UTF-8 string. */
export async function decryptAuditPayload(
	key: CryptoKey,
	blob: EncryptedBlob,
): Promise<string> {
	if (blob.v !== VERSION) {
		throw new Error(`Unsupported audit encryption version: ${blob.v}`);
	}
	const iv = b64Decode(blob.iv);
	const ct = b64Decode(blob.ct);
	const plainBuf = await crypto.subtle.decrypt(
		{ name: ALGO, iv },
		key,
		ct,
	);
	return new TextDecoder().decode(plainBuf);
}

/** Type guard for encrypted blobs. */
export function isEncryptedBlob(value: unknown): value is EncryptedBlob {
	if (!value || typeof value !== "object") return false;
	const o = value as Record<string, unknown>;
	return (
		typeof o.v === "number" &&
		typeof o.iv === "string" &&
		typeof o.ct === "string"
	);
}

/**
 * Generate a new random 32-byte key (base64).
 * Run once offline and store as:
 *   npx wrangler secret put AUDIT_ENCRYPTION_KEY
 */
export function generateAuditKeyB64(): string {
	const raw = crypto.getRandomValues(new Uint8Array(32));
	return b64Encode(raw);
}
