/**
 * Client Portal routes — /api/portal
 */
import { Hono } from "hono";
import {
	advancePortalWorkflow,
	ensureDefaultWorkflow,
	getPortalAccount,
	listPortalAccounts,
	listPortalWorkflows,
	upsertPortalAccount,
	upsertPortalWorkflow,
	type WorkflowStage,
} from "../lib/client-portal";
import { dispatchWebhook } from "../lib/webhook-dispatch";
import type { Env } from "../lib/types";

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

const portal = new Hono<{ Bindings: Env }>();

portal.get("/workflows", async (c) => {
	await ensureDefaultWorkflow(c.env);
	const workflows = await listPortalWorkflows(c.env);
	return c.json({ count: workflows.length, workflows });
});

portal.post("/workflows", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.name || !body?.stages) {
		return c.json({ error: "name and stages required" }, 400);
	}
	const workflow = await upsertPortalWorkflow(c.env, body);
	return c.json(workflow, 201);
});

portal.get("/accounts", async (c) => {
	const limit = Number(c.req.query("limit") ?? 50);
	const offset = Number(c.req.query("offset") ?? 0);
	const accounts = await listPortalAccounts(c.env, limit, offset);
	return c.json({ count: accounts.length, accounts });
});

portal.get("/accounts/:id", async (c) => {
	const account = await getPortalAccount(c.env, c.req.param("id"));
	if (!account) return c.json({ error: "Not found" }, 404);
	return c.json(account);
});

portal.post("/accounts", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.contactId || !body?.email) {
		return c.json({ error: "contactId and email required" }, 400);
	}
	await ensureDefaultWorkflow(c.env);
	const account = await upsertPortalAccount(c.env, body);
	return c.json(account, 201);
});

portal.post("/accounts/:id/advance", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req
		.json<{ stage?: WorkflowStage; workflowId?: string }>()
		.catch(() => null);
	if (!body?.stage) return c.json({ error: "stage required" }, 400);

	try {
		await ensureDefaultWorkflow(c.env);
		const result = await advancePortalWorkflow(
			c.env,
			c.req.param("id"),
			body.stage,
			body.workflowId,
		);
		return c.json(result);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 404);
	}
});

portal.post("/workflows/ensure-default", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const workflow = await ensureDefaultWorkflow(c.env);
	return c.json(workflow);
});

/**
 * Manual outbound webhook (budget Zapier path).
 * Body: { url: string, type?: string, data?: object, secret?: string }
 * Paste your Zapier Catch Hook URL into `url`.
 */
portal.post("/webhook/send", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req
		.json<{
			url?: string;
			type?: string;
			data?: Record<string, unknown>;
			secret?: string;
		}>()
		.catch(() => null);

	if (!body?.url) return c.json({ error: "url required (https Catch Hook)" }, 400);

	const result = await dispatchWebhook(
		body.url,
		body.type ?? "manual.test",
		body.data ?? { message: "ARMR ALEYE test webhook" },
		{ source: "manual" },
		{ secret: body.secret },
	);

	return c.json(result, result.ok ? 200 : 502);
});

export default portal;
