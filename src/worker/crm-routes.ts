/**
 * Native CRM routes — mounted under /api/crm
 */
import { Hono } from "hono";
import {
	getCompany,
	getContact,
	getCrmSnapshot,
	getDeal,
	listAutomations,
	listCompanies,
	listContacts,
	listDeals,
	listSubscriptions,
	listTasks,
	upsertAutomation,
	upsertCompany,
	upsertContact,
	upsertDeal,
	upsertSubscription,
	upsertTask,
} from "../lib/crm-store";
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

const crm = new Hono<{ Bindings: Env }>();

crm.get("/snapshot", async (c) => {
	return c.json(await getCrmSnapshot(c.env));
});

// Contacts
crm.get("/contacts", async (c) => {
	const limit = Number(c.req.query("limit") ?? 50);
	const offset = Number(c.req.query("offset") ?? 0);
	const contacts = await listContacts(c.env, limit, offset);
	return c.json({ count: contacts.length, contacts });
});

crm.get("/contacts/:id", async (c) => {
	const contact = await getContact(c.env, c.req.param("id"));
	if (!contact) return c.json({ error: "Not found" }, 404);
	return c.json(contact);
});

crm.post("/contacts", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.email) return c.json({ error: "email required" }, 400);
	const contact = await upsertContact(c.env, body);
	return c.json(contact, 201);
});

// Companies
crm.get("/companies", async (c) => {
	const limit = Number(c.req.query("limit") ?? 50);
	const offset = Number(c.req.query("offset") ?? 0);
	const companies = await listCompanies(c.env, limit, offset);
	return c.json({ count: companies.length, companies });
});

crm.get("/companies/:id", async (c) => {
	const company = await getCompany(c.env, c.req.param("id"));
	if (!company) return c.json({ error: "Not found" }, 404);
	return c.json(company);
});

crm.post("/companies", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.name) return c.json({ error: "name required" }, 400);
	const company = await upsertCompany(c.env, body);
	return c.json(company, 201);
});

// Deals
crm.get("/deals", async (c) => {
	const limit = Number(c.req.query("limit") ?? 50);
	const offset = Number(c.req.query("offset") ?? 0);
	const deals = await listDeals(c.env, limit, offset);
	return c.json({ count: deals.length, deals });
});

crm.get("/deals/:id", async (c) => {
	const deal = await getDeal(c.env, c.req.param("id"));
	if (!deal) return c.json({ error: "Not found" }, 404);
	return c.json(deal);
});

crm.post("/deals", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.title || !body?.contactId) {
		return c.json({ error: "title and contactId required" }, 400);
	}
	const deal = await upsertDeal(c.env, body);
	return c.json(deal, 201);
});

// Subscriptions
crm.get("/subscriptions", async (c) => {
	const limit = Number(c.req.query("limit") ?? 50);
	const offset = Number(c.req.query("offset") ?? 0);
	const subscriptions = await listSubscriptions(c.env, limit, offset);
	return c.json({ count: subscriptions.length, subscriptions });
});

crm.post("/subscriptions", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.contactId || !body?.planName || !body?.productType) {
		return c.json(
			{ error: "contactId, planName, productType required" },
			400,
		);
	}
	const sub = await upsertSubscription(c.env, body);
	return c.json(sub, 201);
});

// Tasks
crm.get("/tasks", async (c) => {
	const limit = Number(c.req.query("limit") ?? 50);
	const offset = Number(c.req.query("offset") ?? 0);
	const tasks = await listTasks(c.env, limit, offset);
	return c.json({ count: tasks.length, tasks });
});

crm.post("/tasks", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.title) return c.json({ error: "title required" }, 400);
	const task = await upsertTask(c.env, body);
	return c.json(task, 201);
});

// Automations
crm.get("/automations", async (c) => {
	const automations = await listAutomations(c.env);
	return c.json({ count: automations.length, automations });
});

crm.post("/automations", async (c) => {
	if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
	const body = await c.req.json().catch(() => null);
	if (!body?.name || !body?.trigger) {
		return c.json({ error: "name and trigger required" }, 400);
	}
	const rule = await upsertAutomation(c.env, body);
	return c.json(rule, 201);
});

export default crm;
