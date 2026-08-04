/**
 * Client API access tokens — scoped keys for portal clients
 */
import type { CrmStoreEnv } from "../crm-store";

export type ClientScope = "portal:read" | "portal:documents" | "portal:billing";

export interface ClientApiToken {
	id: string;
	contactId: string;
	portalAccountId?: string;
	tokenHash: string;
	scopes: ClientScope[];
	status: "active" | "revoked";
	createdAt: string;
	lastUsedAt?: string;
}

const TTL = 60 * 60 * 24 * 365;

async function sha256Hex(s: string): Promise<string> {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createClientToken(
	env: CrmStoreEnv,
	input: { contactId: string; portalAccountId?: string; scopes?: ClientScope[] },
): Promise<{ token: ClientApiToken; rawToken: string }> {
	const rawToken = `armr_${crypto.randomUUID().replace(/-/g, "")}`;
	const tokenHash = await sha256Hex(rawToken);
	const row: ClientApiToken = {
		id: crypto.randomUUID(),
		contactId: input.contactId,
		portalAccountId: input.portalAccountId,
		tokenHash,
		scopes: input.scopes ?? ["portal:read", "portal:documents"],
		status: "active",
		createdAt: new Date().toISOString(),
	};
	await env.VISIBILITY_CACHE.put(`clientapi:token:${row.id}`, JSON.stringify(row), {
		expirationTtl: TTL,
	});
	await env.VISIBILITY_CACHE.put(`clientapi:hash:${tokenHash}`, row.id, { expirationTtl: TTL });
	const index = ((await env.VISIBILITY_CACHE.get("clientapi:index", "json")) as string[]) || [];
	index.unshift(row.id);
	await env.VISIBILITY_CACHE.put("clientapi:index", JSON.stringify(index), { expirationTtl: TTL });
	return { token: row, rawToken };
}

export async function verifyClientToken(
	env: CrmStoreEnv,
	rawToken: string,
): Promise<ClientApiToken | null> {
	const tokenHash = await sha256Hex(rawToken);
	const id = await env.VISIBILITY_CACHE.get(`clientapi:hash:${tokenHash}`);
	if (!id) return null;
	const row = (await env.VISIBILITY_CACHE.get(`clientapi:token:${id}`, "json")) as ClientApiToken | null;
	if (!row || row.status !== "active") return null;
	row.lastUsedAt = new Date().toISOString();
	await env.VISIBILITY_CACHE.put(`clientapi:token:${id}`, JSON.stringify(row), {
		expirationTtl: TTL,
	});
	return row;
}

export async function listClientTokens(env: CrmStoreEnv): Promise<ClientApiToken[]> {
	const index = ((await env.VISIBILITY_CACHE.get("clientapi:index", "json")) as string[]) || [];
	const out: ClientApiToken[] = [];
	for (const id of index) {
		const t = (await env.VISIBILITY_CACHE.get(`clientapi:token:${id}`, "json")) as ClientApiToken | null;
		if (t) out.push(t);
	}
	return out;
}
