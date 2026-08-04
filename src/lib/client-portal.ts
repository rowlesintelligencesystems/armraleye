/**
 * Client Portal + Automated Workflows
 * 17hats-inspired: lead → qualify → proposal → access → active client
 */

import type { AuditStoreEnv } from "./audit-store";
import { persistAuditEvent } from "./audit-store";
import { dispatchWebhook } from "./webhook-dispatch";
import { createAuditEvent } from "./zero-trust";

export type PortalAccessLevel = "view" | "documents" | "billing" | "full";
export type PortalStatus = "invited" | "active" | "suspended" | "revoked";
export type WorkflowStage =
	| "lead_captured"
	| "qualified"
	| "proposal_sent"
	| "proposal_accepted"
	| "portal_provisioned"
	| "onboarded"
	| "active"
	| "churned";

export interface ClientPortalAccount {
	id: string;
	contactId: string;
	email: string;
	status: PortalStatus;
	accessLevel: PortalAccessLevel;
	ringId?: string;
	apiTokenHash?: string;
	workflowStage: WorkflowStage;
	documents: PortalDocument[];
	createdAt: string;
	updatedAt: string;
	lastAccessAt?: string;
}

export interface PortalDocument {
	id: string;
	title: string;
	type: "proposal" | "contract" | "invoice" | "questionnaire" | "other";
	url?: string;
	status: "draft" | "sent" | "viewed" | "signed" | "paid";
	createdAt: string;
}

export interface PortalWorkflow {
	id: string;
	name: string;
	enabled: boolean;
	stages: WorkflowStage[];
	onEnter: Partial<Record<WorkflowStage, PortalWorkflowAction[]>>;
	createdAt: string;
	updatedAt: string;
}

export type PortalWorkflowActionType =
	| "send_email"
	| "create_document"
	| "provision_portal"
	| "set_access_level"
	| "create_task"
	| "emit_audit"
	| "webhook";

export interface PortalWorkflowAction {
	type: PortalWorkflowActionType;
	config: Record<string, unknown>;
}

export interface PortalStoreEnv extends AuditStoreEnv {}

const PREFIX = {
	portal: "portal:account:",
	workflow: "portal:workflow:",
	indexAccounts: "portal:index:accounts",
	indexWorkflows: "portal:index:workflows",
};

const TTL = 60 * 60 * 24 * 365;

async function getIndex(env: PortalStoreEnv, key: string): Promise<string[]> {
	const raw = await env.VISIBILITY_CACHE.get(key, "json");
	return Array.isArray(raw) ? (raw as string[]) : [];
}

async function putIndex(
	env: PortalStoreEnv,
	key: string,
	ids: string[],
): Promise<void> {
	await env.VISIBILITY_CACHE.put(key, JSON.stringify(ids), {
		expirationTtl: TTL,
	});
}

export async function upsertPortalAccount(
	env: PortalStoreEnv,
	input: Omit<
		ClientPortalAccount,
		"id" | "createdAt" | "updatedAt" | "documents"
	> & {
		id?: string;
		documents?: PortalDocument[];
	},
): Promise<ClientPortalAccount> {
	const now = new Date().toISOString();
	const existing = input.id ? await getPortalAccount(env, input.id) : null;

	const account: ClientPortalAccount = {
		id: input.id ?? crypto.randomUUID(),
		contactId: input.contactId,
		email: input.email,
		status: input.status ?? "invited",
		accessLevel: input.accessLevel ?? "view",
		ringId: input.ringId,
		apiTokenHash: input.apiTokenHash,
		workflowStage: input.workflowStage ?? "lead_captured",
		documents: input.documents ?? existing?.documents ?? [],
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
		lastAccessAt: input.lastAccessAt ?? existing?.lastAccessAt,
	};

	await env.VISIBILITY_CACHE.put(
		`${PREFIX.portal}${account.id}`,
		JSON.stringify(account),
		{ expirationTtl: TTL },
	);

	const index = await getIndex(env, PREFIX.indexAccounts);
	if (!index.includes(account.id)) {
		index.unshift(account.id);
		await putIndex(env, PREFIX.indexAccounts, index);
	}

	return account;
}

export async function getPortalAccount(
	env: PortalStoreEnv,
	id: string,
): Promise<ClientPortalAccount | null> {
	const raw = await env.VISIBILITY_CACHE.get(`${PREFIX.portal}${id}`, "json");
	if (!raw || typeof raw !== "object") return null;
	return raw as ClientPortalAccount;
}

export async function listPortalAccounts(
	env: PortalStoreEnv,
	limit = 50,
	offset = 0,
): Promise<ClientPortalAccount[]> {
	const index = await getIndex(env, PREFIX.indexAccounts);
	const slice = index.slice(offset, offset + limit);
	const results = await Promise.all(
		slice.map((id) => getPortalAccount(env, id)),
	);
	return results.filter((x): x is ClientPortalAccount => x !== null);
}

export async function upsertPortalWorkflow(
	env: PortalStoreEnv,
	input: Omit<PortalWorkflow, "id" | "createdAt" | "updatedAt"> & {
		id?: string;
	},
): Promise<PortalWorkflow> {
	const now = new Date().toISOString();
	const existing = input.id ? await getPortalWorkflow(env, input.id) : null;

	const workflow: PortalWorkflow = {
		id: input.id ?? crypto.randomUUID(),
		name: input.name,
		enabled: input.enabled ?? true,
		stages: input.stages,
		onEnter: input.onEnter ?? {},
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
	};

	await env.VISIBILITY_CACHE.put(
		`${PREFIX.workflow}${workflow.id}`,
		JSON.stringify(workflow),
		{ expirationTtl: TTL },
	);

	const index = await getIndex(env, PREFIX.indexWorkflows);
	if (!index.includes(workflow.id)) {
		index.unshift(workflow.id);
		await putIndex(env, PREFIX.indexWorkflows, index);
	}

	return workflow;
}

export async function getPortalWorkflow(
	env: PortalStoreEnv,
	id: string,
): Promise<PortalWorkflow | null> {
	const raw = await env.VISIBILITY_CACHE.get(
		`${PREFIX.workflow}${id}`,
		"json",
	);
	if (!raw || typeof raw !== "object") return null;
	return raw as PortalWorkflow;
}

export async function listPortalWorkflows(
	env: PortalStoreEnv,
): Promise<PortalWorkflow[]> {
	const index = await getIndex(env, PREFIX.indexWorkflows);
	const results = await Promise.all(
		index.map((id) => getPortalWorkflow(env, id)),
	);
	return results.filter((x): x is PortalWorkflow => x !== null);
}

export function defaultLeadToClientWorkflow(): Omit<
	PortalWorkflow,
	"id" | "createdAt" | "updatedAt"
> {
	return {
		name: "Lead to Client (Portal)",
		enabled: true,
		stages: [
			"lead_captured",
			"qualified",
			"proposal_sent",
			"proposal_accepted",
			"portal_provisioned",
			"onboarded",
			"active",
		],
		onEnter: {
			lead_captured: [
				{ type: "emit_audit", config: { event: "portal.lead_captured" } },
				{ type: "create_task", config: { title: "Review new lead" } },
			],
			qualified: [
				{
					type: "create_document",
					config: {
						docType: "questionnaire",
						title: "Intake Questionnaire",
					},
				},
			],
			proposal_sent: [
				{
					type: "create_document",
					config: { docType: "proposal", title: "Service Proposal" },
				},
				{ type: "send_email", config: { template: "proposal_sent" } },
			],
			proposal_accepted: [
				{
					type: "create_document",
					config: { docType: "contract", title: "Service Agreement" },
				},
			],
			portal_provisioned: [
				{ type: "provision_portal", config: { accessLevel: "documents" } },
				{ type: "send_email", config: { template: "portal_invite" } },
				{ type: "emit_audit", config: { event: "portal.provisioned" } },
			],
			onboarded: [
				{ type: "set_access_level", config: { accessLevel: "full" } },
				{ type: "send_email", config: { template: "welcome_onboarded" } },
			],
			active: [
				{ type: "emit_audit", config: { event: "portal.client_active" } },
			],
		},
	};
}

export interface AdvanceResult {
	account: ClientPortalAccount;
	previousStage: WorkflowStage;
	newStage: WorkflowStage;
	actionsRun: PortalWorkflowAction[];
	log: string[];
}

export async function advancePortalWorkflow(
	env: PortalStoreEnv,
	accountId: string,
	newStage: WorkflowStage,
	workflowId?: string,
): Promise<AdvanceResult> {
	const account = await getPortalAccount(env, accountId);
	if (!account) throw new Error("Portal account not found");

	const previousStage = account.workflowStage;
	const log: string[] = [];
	const actionsRun: PortalWorkflowAction[] = [];

	let workflow: PortalWorkflow | null = null;
	if (workflowId) {
		workflow = await getPortalWorkflow(env, workflowId);
	} else {
		const all = await listPortalWorkflows(env);
		workflow = all.find((w) => w.enabled) ?? null;
	}

	const actions = workflow?.onEnter?.[newStage] ?? [];

	for (const action of actions) {
		actionsRun.push(action);
		switch (action.type) {
			case "provision_portal": {
				account.status = "active";
				account.accessLevel =
					(action.config.accessLevel as PortalAccessLevel) ?? "documents";
				log.push(`provision_portal → access=${account.accessLevel}`);
				break;
			}
			case "set_access_level": {
				account.accessLevel =
					(action.config.accessLevel as PortalAccessLevel) ??
					account.accessLevel;
				log.push(`set_access_level → ${account.accessLevel}`);
				break;
			}
			case "create_document": {
				const doc: PortalDocument = {
					id: crypto.randomUUID(),
					title: String(action.config.title ?? "Document"),
					type: (action.config.docType as PortalDocument["type"]) ?? "other",
					status: "sent",
					createdAt: new Date().toISOString(),
				};
				account.documents.push(doc);
				log.push(`create_document → ${doc.title}`);
				break;
			}
			case "send_email": {
				log.push(
					`send_email → template=${action.config.template ?? "default"}`,
				);
				break;
			}
			case "create_task": {
				log.push(`create_task → ${action.config.title ?? "Task"}`);
				break;
			}
			case "emit_audit": {
				const identity = {
					subjectId: account.ringId ?? account.contactId,
					authMethod: "none" as const,
					ringVerified: Boolean(account.ringId),
					doctrineOneCompliant: true,
				};
				const fakeResult = {
					decision: "allow" as const,
					reason: String(action.config.event ?? "portal.workflow"),
					policyId: "portal-workflow",
					evaluatedAt: new Date().toISOString(),
				};
				const audit = createAuditEvent(
					identity,
					`/portal/${account.id}`,
					"workflow",
					fakeResult,
					{ stage: newStage, accountId: account.id },
				);
				try {
					await persistAuditEvent(env, audit);
					log.push(`emit_audit → ${audit.id}`);
				} catch {
					log.push("emit_audit → failed");
				}
				break;
			}
			case "webhook": {
				const url = String(action.config.url ?? "");
				const eventType =
					String(action.config.eventType ?? `portal.${newStage}`);
				const result = await dispatchWebhook(
					url,
					eventType,
					{
						portalAccountId: account.id,
						contactId: account.contactId,
						email: account.email,
						status: account.status,
						accessLevel: account.accessLevel,
						workflowStage: newStage,
						ringId: account.ringId,
					},
					{
						source: "portal",
						previousStage,
					},
					{
						secret:
							typeof action.config.secret === "string"
								? action.config.secret
								: undefined,
					},
				);
				log.push(
					result.ok
						? `webhook → ok ${result.status} evt=${result.eventId}`
						: `webhook → failed ${result.error}`,
				);
				break;
			}
			default:
				log.push(`unknown_action → ${action.type}`);
		}
	}

	account.workflowStage = newStage;
	account.updatedAt = new Date().toISOString();

	await env.VISIBILITY_CACHE.put(
		`${PREFIX.portal}${account.id}`,
		JSON.stringify(account),
		{ expirationTtl: TTL },
	);

	return { account, previousStage, newStage, actionsRun, log };
}

export async function ensureDefaultWorkflow(
	env: PortalStoreEnv,
): Promise<PortalWorkflow> {
	const existing = await listPortalWorkflows(env);
	const found = existing.find((w) => w.name === "Lead to Client (Portal)");
	if (found) return found;
	return upsertPortalWorkflow(env, defaultLeadToClientWorkflow());
}
