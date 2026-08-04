/**
 * ARMR ALEYE Native CRM — KV Store
 */

import type {
	AutomationRule,
	Company,
	Contact,
	CrmSnapshot,
	Deal,
	DealStage,
	Subscription,
	Task,
} from "./crm-types";

const PREFIX = {
	contact: "crm:contact:",
	company: "crm:company:",
	deal: "crm:deal:",
	subscription: "crm:sub:",
	task: "crm:task:",
	automation: "crm:auto:",
	index: {
		contacts: "crm:index:contacts",
		companies: "crm:index:companies",
		deals: "crm:index:deals",
		subscriptions: "crm:index:subscriptions",
		tasks: "crm:index:tasks",
		automations: "crm:index:automations",
	},
};

const TTL = 60 * 60 * 24 * 365;

export interface CrmStoreEnv {
	VISIBILITY_CACHE: KVNamespace;
}

async function getIndex(env: CrmStoreEnv, key: string): Promise<string[]> {
	const raw = await env.VISIBILITY_CACHE.get(key, "json");
	return Array.isArray(raw) ? (raw as string[]) : [];
}

async function putIndex(
	env: CrmStoreEnv,
	key: string,
	ids: string[],
): Promise<void> {
	await env.VISIBILITY_CACHE.put(key, JSON.stringify(ids), {
		expirationTtl: TTL,
	});
}

async function putEntity<T extends { id: string }>(
	env: CrmStoreEnv,
	prefix: string,
	indexKey: string,
	entity: T,
): Promise<T> {
	await env.VISIBILITY_CACHE.put(
		`${prefix}${entity.id}`,
		JSON.stringify(entity),
		{ expirationTtl: TTL },
	);
	const index = await getIndex(env, indexKey);
	if (!index.includes(entity.id)) {
		index.unshift(entity.id);
		await putIndex(env, indexKey, index);
	}
	return entity;
}

async function getEntity<T>(
	env: CrmStoreEnv,
	prefix: string,
	id: string,
): Promise<T | null> {
	const raw = await env.VISIBILITY_CACHE.get(`${prefix}${id}`, "json");
	if (!raw || typeof raw !== "object") return null;
	return raw as T;
}

async function listEntities<T>(
	env: CrmStoreEnv,
	prefix: string,
	indexKey: string,
	limit = 50,
	offset = 0,
): Promise<T[]> {
	const index = await getIndex(env, indexKey);
	const slice = index.slice(offset, offset + limit);
	const results = await Promise.all(
		slice.map((id) => getEntity<T>(env, prefix, id)),
	);
	return results.filter((x): x is T => x !== null);
}

export async function upsertContact(
	env: CrmStoreEnv,
	input: Omit<Contact, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<Contact> {
	const now = new Date().toISOString();
	const existing = input.id
		? await getEntity<Contact>(env, PREFIX.contact, input.id)
		: null;

	const contact: Contact = {
		id: input.id ?? crypto.randomUUID(),
		email: input.email,
		name: input.name,
		phone: input.phone,
		companyId: input.companyId,
		status: input.status ?? "lead",
		ringId: input.ringId,
		doctrineOneCompliant: input.doctrineOneCompliant,
		tags: input.tags ?? [],
		source: input.source,
		notes: input.notes,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};

	return putEntity(env, PREFIX.contact, PREFIX.index.contacts, contact);
}

export async function getContact(
	env: CrmStoreEnv,
	id: string,
): Promise<Contact | null> {
	return getEntity(env, PREFIX.contact, id);
}

export async function listContacts(
	env: CrmStoreEnv,
	limit = 50,
	offset = 0,
): Promise<Contact[]> {
	return listEntities(env, PREFIX.contact, PREFIX.index.contacts, limit, offset);
}

export async function upsertCompany(
	env: CrmStoreEnv,
	input: Omit<Company, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<Company> {
	const now = new Date().toISOString();
	const existing = input.id
		? await getEntity<Company>(env, PREFIX.company, input.id)
		: null;

	const company: Company = {
		id: input.id ?? crypto.randomUUID(),
		name: input.name,
		domain: input.domain,
		industry: input.industry,
		size: input.size,
		tags: input.tags ?? [],
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};

	return putEntity(env, PREFIX.company, PREFIX.index.companies, company);
}

export async function getCompany(
	env: CrmStoreEnv,
	id: string,
): Promise<Company | null> {
	return getEntity(env, PREFIX.company, id);
}

export async function listCompanies(
	env: CrmStoreEnv,
	limit = 50,
	offset = 0,
): Promise<Company[]> {
	return listEntities(env, PREFIX.company, PREFIX.index.companies, limit, offset);
}

export async function upsertDeal(
	env: CrmStoreEnv,
	input: Omit<Deal, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<Deal> {
	const now = new Date().toISOString();
	const existing = input.id
		? await getEntity<Deal>(env, PREFIX.deal, input.id)
		: null;

	const deal: Deal = {
		id: input.id ?? crypto.randomUUID(),
		title: input.title,
		contactId: input.contactId,
		companyId: input.companyId,
		stage: input.stage ?? "inquiry",
		value: input.value,
		currency: input.currency ?? "USD",
		productType: input.productType,
		expectedClose: input.expectedClose,
		notes: input.notes,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};

	return putEntity(env, PREFIX.deal, PREFIX.index.deals, deal);
}

export async function getDeal(
	env: CrmStoreEnv,
	id: string,
): Promise<Deal | null> {
	return getEntity(env, PREFIX.deal, id);
}

export async function listDeals(
	env: CrmStoreEnv,
	limit = 50,
	offset = 0,
): Promise<Deal[]> {
	return listEntities(env, PREFIX.deal, PREFIX.index.deals, limit, offset);
}

export async function upsertSubscription(
	env: CrmStoreEnv,
	input: Omit<Subscription, "id"> & { id?: string },
): Promise<Subscription> {
	const sub: Subscription = {
		id: input.id ?? crypto.randomUUID(),
		contactId: input.contactId,
		productType: input.productType,
		planName: input.planName,
		status: input.status ?? "active",
		startedAt: input.startedAt ?? new Date().toISOString(),
		renewsAt: input.renewsAt,
		cancelledAt: input.cancelledAt,
		metadata: input.metadata,
	};

	return putEntity(env, PREFIX.subscription, PREFIX.index.subscriptions, sub);
}

export async function listSubscriptions(
	env: CrmStoreEnv,
	limit = 50,
	offset = 0,
): Promise<Subscription[]> {
	return listEntities(
		env,
		PREFIX.subscription,
		PREFIX.index.subscriptions,
		limit,
		offset,
	);
}

export async function upsertTask(
	env: CrmStoreEnv,
	input: Omit<Task, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<Task> {
	const now = new Date().toISOString();
	const existing = input.id
		? await getEntity<Task>(env, PREFIX.task, input.id)
		: null;

	const task: Task = {
		id: input.id ?? crypto.randomUUID(),
		title: input.title,
		contactId: input.contactId,
		dealId: input.dealId,
		status: input.status ?? "open",
		dueAt: input.dueAt,
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};

	return putEntity(env, PREFIX.task, PREFIX.index.tasks, task);
}

export async function listTasks(
	env: CrmStoreEnv,
	limit = 50,
	offset = 0,
): Promise<Task[]> {
	return listEntities(env, PREFIX.task, PREFIX.index.tasks, limit, offset);
}

export async function upsertAutomation(
	env: CrmStoreEnv,
	input: Omit<AutomationRule, "id" | "createdAt" | "updatedAt"> & {
		id?: string;
	},
): Promise<AutomationRule> {
	const now = new Date().toISOString();
	const existing = input.id
		? await getEntity<AutomationRule>(env, PREFIX.automation, input.id)
		: null;

	const rule: AutomationRule = {
		id: input.id ?? crypto.randomUUID(),
		name: input.name,
		enabled: input.enabled ?? true,
		trigger: input.trigger,
		conditions: input.conditions,
		actions: input.actions ?? [],
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};

	return putEntity(env, PREFIX.automation, PREFIX.index.automations, rule);
}

export async function listAutomations(
	env: CrmStoreEnv,
): Promise<AutomationRule[]> {
	return listEntities(env, PREFIX.automation, PREFIX.index.automations, 100, 0);
}

export async function getCrmSnapshot(env: CrmStoreEnv): Promise<CrmSnapshot> {
	const [contacts, companies, deals, subscriptions, tasks, automations] =
		await Promise.all([
			getIndex(env, PREFIX.index.contacts),
			getIndex(env, PREFIX.index.companies),
			getIndex(env, PREFIX.index.deals),
			getIndex(env, PREFIX.index.subscriptions),
			getIndex(env, PREFIX.index.tasks),
			getIndex(env, PREFIX.index.automations),
		]);

	const dealEntities = await listDeals(env, 200, 0);
	const pipeline: Record<DealStage, number> = {
		inquiry: 0,
		qualified: 0,
		proposal: 0,
		negotiation: 0,
		won: 0,
		lost: 0,
	};
	for (const d of dealEntities) {
		pipeline[d.stage] = (pipeline[d.stage] ?? 0) + 1;
	}

	return {
		counts: {
			contacts: contacts.length,
			companies: companies.length,
			deals: deals.length,
			subscriptions: subscriptions.length,
			tasks: tasks.length,
			automations: automations.length,
		},
		pipeline,
		generatedAt: new Date().toISOString(),
	};
}
