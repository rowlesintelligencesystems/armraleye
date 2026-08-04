/**
 * Marketing + Traffic attribution
 */
import type { CrmStoreEnv } from "../crm-store";

export interface Campaign {
	id: string;
	name: string;
	status: "draft" | "active" | "paused" | "completed";
	sourceId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TrafficEvent {
	id: string;
	source: string;
	medium?: string;
	campaign?: string;
	path?: string;
	contactId?: string;
	createdAt: string;
}

const TTL = 60 * 60 * 24 * 365;

export async function recordTraffic(
	env: CrmStoreEnv,
	event: Omit<TrafficEvent, "id" | "createdAt">,
): Promise<TrafficEvent> {
	const row: TrafficEvent = {
		id: crypto.randomUUID(),
		...event,
		createdAt: new Date().toISOString(),
	};
	await env.VISIBILITY_CACHE.put(`traffic:evt:${row.id}`, JSON.stringify(row), {
		expirationTtl: TTL,
	});
	const index = ((await env.VISIBILITY_CACHE.get("traffic:index", "json")) as string[]) || [];
	index.unshift(row.id);
	await env.VISIBILITY_CACHE.put("traffic:index", JSON.stringify(index.slice(0, 500)), {
		expirationTtl: TTL,
	});
	return row;
}

export async function listTraffic(env: CrmStoreEnv, limit = 50): Promise<TrafficEvent[]> {
	const index = ((await env.VISIBILITY_CACHE.get("traffic:index", "json")) as string[]) || [];
	const out: TrafficEvent[] = [];
	for (const id of index.slice(0, limit)) {
		const e = (await env.VISIBILITY_CACHE.get(`traffic:evt:${id}`, "json")) as TrafficEvent | null;
		if (e) out.push(e);
	}
	return out;
}

export async function upsertCampaign(
	env: CrmStoreEnv,
	input: Omit<Campaign, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<Campaign> {
	const now = new Date().toISOString();
	const existing = input.id
		? ((await env.VISIBILITY_CACHE.get(`mkt:campaign:${input.id}`, "json")) as Campaign | null)
		: null;
	const campaign: Campaign = {
		id: input.id ?? crypto.randomUUID(),
		name: input.name,
		status: input.status ?? "draft",
		sourceId: input.sourceId,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};
	await env.VISIBILITY_CACHE.put(`mkt:campaign:${campaign.id}`, JSON.stringify(campaign), {
		expirationTtl: TTL,
	});
	const index = ((await env.VISIBILITY_CACHE.get("mkt:index:campaigns", "json")) as string[]) || [];
	if (!index.includes(campaign.id)) {
		index.unshift(campaign.id);
		await env.VISIBILITY_CACHE.put("mkt:index:campaigns", JSON.stringify(index), {
			expirationTtl: TTL,
		});
	}
	return campaign;
}

export async function listCampaigns(env: CrmStoreEnv): Promise<Campaign[]> {
	const index = ((await env.VISIBILITY_CACHE.get("mkt:index:campaigns", "json")) as string[]) || [];
	const out: Campaign[] = [];
	for (const id of index) {
		const c = (await env.VISIBILITY_CACHE.get(`mkt:campaign:${id}`, "json")) as Campaign | null;
		if (c) out.push(c);
	}
	return out;
}
