/**
 * Unified suite routes under /api/suite
 */
import { Hono } from "hono";
import type { Env } from "../lib/types";
import type { AutomationTrigger } from "../lib/crm-types";
import { systemsSummary } from "../lib/systems/registry";
import {
	listInvoices,
	listQuotes,
	salesSnapshot,
	upsertInvoice,
	upsertQuote,
} from "../lib/systems/sales";
import {
	listCampaigns,
	listTraffic,
	recordTraffic,
	upsertCampaign,
} from "../lib/systems/marketing";
import { getAnalyticsSnapshot } from "../lib/systems/analytics";
import {
	createClientToken,
	listClientTokens,
	verifyClientToken,
} from "../lib/systems/client-api";
import { runAutomations } from "../lib/systems/automation-engine";

function isAuthorized(c: {
	env: Env;
	req: { header: (k: string) => string | undefined };
}): boolean {
	const configured = c.env.ADMIN_TOKEN;
	if (!configured) return false;
	const header = c.req.header("authorization") ?? "";
	const token = header.replace(/^Bearer\s+/i, "");
	return token.length > 0 && token === configured;
}

const suite = new Hono<{ Bindings: Env }>();

suite.get("/systems", (c) => c.json(systemsSummary()));

suite.get("/sales/snapshot", async (c) => c.json(await salesSnapshot(c.env)));
suite.get("/sales/quotes", async (c) =>
	c.json({ quotes: await listQuotes(c.env) }),
);
suite.post("/sales/quotes", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.contactId || !body?.title)
		return c.json({ error: "contactId and title required" }, 400);
	return c.json(await upsertQuote(c.env, body), 201);
});
suite.get("/sales/invoices", async (c) =>
	c.json({ invoices: await listInvoices(c.env) }),
);
suite.post("/sales/invoices", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.contactId || !body?.title)
		return c.json({ error: "contactId and title required" }, 400);
	return c.json(await upsertInvoice(c.env, body), 201);
});

suite.get("/marketing/campaigns", async (c) =>
	c.json({ campaigns: await listCampaigns(c.env) }),
);
suite.post("/marketing/campaigns", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.name) return c.json({ error: "name required" }, 400);
	return c.json(await upsertCampaign(c.env, body), 201);
});
suite.get("/traffic", async (c) =>
	c.json({ events: await listTraffic(c.env) }),
);
suite.post("/traffic", async (c) => {
	const body = await c.req.json().catch(() => null);
	if (!body?.source) return c.json({ error: "source required" }, 400);
	return c.json(await recordTraffic(c.env, body), 201);
});

suite.get("/analytics", async (c) =>
	c.json(await getAnalyticsSnapshot(c.env)),
);

suite.get("/client-api/tokens", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	return c.json({ tokens: await listClientTokens(c.env) });
});
suite.post("/client-api/tokens", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.contactId) return c.json({ error: "contactId required" }, 400);
	return c.json(await createClientToken(c.env, body), 201);
});
suite.post("/client-api/verify", async (c) => {
	const body = await c.req.json().catch(() => null);
	const raw =
		body?.token ||
		(c.req.header("authorization") ?? "").replace(/^Bearer\s+/i, "");
	if (!raw) return c.json({ error: "token required" }, 400);
	const token = await verifyClientToken(c.env, raw);
	if (!token) return c.json({ verified: false }, 401);
	return c.json({ verified: true, token });
});

suite.post("/automations/run", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req
		.json<{ trigger?: AutomationTrigger; payload?: Record<string, unknown> }>()
		.catch(() => null);
	if (!body?.trigger) return c.json({ error: "trigger required" }, 400);
	return c.json(await runAutomations(c.env, body.trigger, body.payload ?? {}));
});

export default suite;
