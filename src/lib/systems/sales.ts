/**
 * Sales subsystem — quotes, invoices, payment status
 */
import type { CrmStoreEnv } from "../crm-store";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";

export interface LineItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	productType?: string;
}

export interface Quote {
	id: string;
	contactId: string;
	title: string;
	status: QuoteStatus;
	lineItems: LineItem[];
	currency: string;
	total: number;
	validUntil?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Invoice {
	id: string;
	contactId: string;
	quoteId?: string;
	title: string;
	status: InvoiceStatus;
	lineItems: LineItem[];
	currency: string;
	total: number;
	dueAt?: string;
	paidAt?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

const TTL = 60 * 60 * 24 * 365;
const Q = { entity: "sales:quote:", index: "sales:index:quotes" };
const I = { entity: "sales:invoice:", index: "sales:index:invoices" };

async function idx(env: CrmStoreEnv, key: string): Promise<string[]> {
	const raw = await env.VISIBILITY_CACHE.get(key, "json");
	return Array.isArray(raw) ? (raw as string[]) : [];
}
async function putIdx(env: CrmStoreEnv, key: string, ids: string[]) {
	await env.VISIBILITY_CACHE.put(key, JSON.stringify(ids), { expirationTtl: TTL });
}
function sum(items: LineItem[]) {
	return items.reduce((a, x) => a + x.quantity * x.unitPrice, 0);
}

export async function upsertQuote(
	env: CrmStoreEnv,
	input: Omit<Quote, "id" | "createdAt" | "updatedAt" | "total"> & { id?: string },
): Promise<Quote> {
	const now = new Date().toISOString();
	const existing = input.id
		? ((await env.VISIBILITY_CACHE.get(`${Q.entity}${input.id}`, "json")) as Quote | null)
		: null;
	const quote: Quote = {
		id: input.id ?? crypto.randomUUID(),
		contactId: input.contactId,
		title: input.title,
		status: input.status ?? "draft",
		lineItems: input.lineItems ?? [],
		currency: input.currency ?? "USD",
		total: sum(input.lineItems ?? []),
		validUntil: input.validUntil,
		notes: input.notes,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};
	await env.VISIBILITY_CACHE.put(`${Q.entity}${quote.id}`, JSON.stringify(quote), {
		expirationTtl: TTL,
	});
	const index = await idx(env, Q.index);
	if (!index.includes(quote.id)) {
		index.unshift(quote.id);
		await putIdx(env, Q.index, index);
	}
	return quote;
}

export async function listQuotes(env: CrmStoreEnv, limit = 50): Promise<Quote[]> {
	const index = await idx(env, Q.index);
	const out: Quote[] = [];
	for (const id of index.slice(0, limit)) {
		const q = (await env.VISIBILITY_CACHE.get(`${Q.entity}${id}`, "json")) as Quote | null;
		if (q) out.push(q);
	}
	return out;
}

export async function upsertInvoice(
	env: CrmStoreEnv,
	input: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "total"> & { id?: string },
): Promise<Invoice> {
	const now = new Date().toISOString();
	const existing = input.id
		? ((await env.VISIBILITY_CACHE.get(`${I.entity}${input.id}`, "json")) as Invoice | null)
		: null;
	const invoice: Invoice = {
		id: input.id ?? crypto.randomUUID(),
		contactId: input.contactId,
		quoteId: input.quoteId,
		title: input.title,
		status: input.status ?? "draft",
		lineItems: input.lineItems ?? [],
		currency: input.currency ?? "USD",
		total: sum(input.lineItems ?? []),
		dueAt: input.dueAt,
		paidAt: input.paidAt,
		notes: input.notes,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};
	await env.VISIBILITY_CACHE.put(`${I.entity}${invoice.id}`, JSON.stringify(invoice), {
		expirationTtl: TTL,
	});
	const index = await idx(env, I.index);
	if (!index.includes(invoice.id)) {
		index.unshift(invoice.id);
		await putIdx(env, I.index, index);
	}
	return invoice;
}

export async function listInvoices(env: CrmStoreEnv, limit = 50): Promise<Invoice[]> {
	const index = await idx(env, I.index);
	const out: Invoice[] = [];
	for (const id of index.slice(0, limit)) {
		const inv = (await env.VISIBILITY_CACHE.get(`${I.entity}${id}`, "json")) as Invoice | null;
		if (inv) out.push(inv);
	}
	return out;
}

export async function salesSnapshot(env: CrmStoreEnv) {
	const [quotes, invoices] = await Promise.all([listQuotes(env, 200), listInvoices(env, 200)]);
	return {
		quoteCount: quotes.length,
		invoiceCount: invoices.length,
		quoteTotal: quotes.reduce((a, q) => a + q.total, 0),
		invoicePaid: invoices.filter((i) => i.status === "paid").reduce((a, i) => a + i.total, 0),
		invoiceOpen: invoices
			.filter((i) => i.status === "sent" || i.status === "overdue")
			.reduce((a, i) => a + i.total, 0),
		generatedAt: new Date().toISOString(),
	};
}
