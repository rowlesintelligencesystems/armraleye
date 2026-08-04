/**
 * ARMR ALEYE Native CRM — Type System
 * Comprehensive suite living under Area 44 / Command Center.
 */

export type ContactStatus =
	| "lead"
	| "qualified"
	| "customer"
	| "churned"
	| "blocked";

export type DealStage =
	| "inquiry"
	| "qualified"
	| "proposal"
	| "negotiation"
	| "won"
	| "lost";

export type ProductType =
	| "saas"
	| "subscription"
	| "service"
	| "architecture"
	| "dashboard"
	| "nfc-ring"
	| "other";

export type AutomationTrigger =
	| "contact.created"
	| "contact.status_changed"
	| "deal.stage_changed"
	| "deal.won"
	| "subscription.created"
	| "subscription.cancelled"
	| "doctrine.non_compliant"
	| "ring.linked"
	| "ring.unlinked";

export type AutomationActionType =
	| "notify"
	| "update_contact_status"
	| "create_task"
	| "emit_audit"
	| "webhook";

export interface Contact {
	id: string;
	email: string;
	name?: string;
	phone?: string;
	companyId?: string;
	status: ContactStatus;
	/** Linked NFC Ring subject id (Area 44 identity). */
	ringId?: string;
	doctrineOneCompliant?: boolean;
	tags: string[];
	source?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Company {
	id: string;
	name: string;
	domain?: string;
	industry?: string;
	size?: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Deal {
	id: string;
	title: string;
	contactId: string;
	companyId?: string;
	stage: DealStage;
	value?: number;
	currency?: string;
	productType?: ProductType;
	expectedClose?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Subscription {
	id: string;
	contactId: string;
	productType: ProductType;
	planName: string;
	status: "active" | "paused" | "cancelled" | "past_due";
	startedAt: string;
	renewsAt?: string;
	cancelledAt?: string;
	metadata?: Record<string, unknown>;
}

export interface Task {
	id: string;
	title: string;
	contactId?: string;
	dealId?: string;
	status: "open" | "done" | "cancelled";
	dueAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AutomationRule {
	id: string;
	name: string;
	enabled: boolean;
	trigger: AutomationTrigger;
	/** Optional filter conditions (simple key/value match on event payload). */
	conditions?: Record<string, string>;
	actions: AutomationAction[];
	createdAt: string;
	updatedAt: string;
}

export interface AutomationAction {
	type: AutomationActionType;
	config: Record<string, unknown>;
}

export interface CrmEvent {
	id: string;
	type: AutomationTrigger;
	payload: Record<string, unknown>;
	createdAt: string;
}

export interface CrmSnapshot {
	counts: {
		contacts: number;
		companies: number;
		deals: number;
		subscriptions: number;
		tasks: number;
		automations: number;
	};
	pipeline: Record<DealStage, number>;
	generatedAt: string;
}
