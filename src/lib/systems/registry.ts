/**
 * ARMR ALEYE — Systems & Subsystems Registry
 */

export type SystemStatus = "active" | "partial" | "planned" | "external";

export interface SystemEntry {
	id: string;
	name: string;
	layer: "os" | "area44" | "jhetti" | "commerce" | "ops";
	status: SystemStatus;
	path?: string;
	api?: string;
	notes?: string;
}

export const SYSTEMS_REGISTRY: SystemEntry[] = [
	{ id: "agent-visibility", name: "Agent Visibility Surfaces", layer: "os", status: "active", api: "/llms.txt,/index.json" },
	{ id: "marketing-site", name: "Marketing Site", layer: "os", status: "partial", path: "site/" },
	{ id: "command-center", name: "Command Center", layer: "ops", status: "active", api: "/api/command-center" },
	{ id: "zero-trust", name: "Zero Trust Engine", layer: "area44", status: "active", path: "src/lib/zero-trust.ts" },
	{ id: "area44-control", name: "Area 44 Control Plane", layer: "area44", status: "active", api: "/api/area44/*" },
	{ id: "audit-store", name: "Audit Persistence", layer: "area44", status: "active" },
	{ id: "audit-crypto", name: "Audit Encryption", layer: "area44", status: "active" },
	{ id: "locked-core", name: "Locked Core Hash Verification", layer: "area44", status: "active", api: "/api/area44/locked-core" },
	{ id: "nfc-identity", name: "NFC Ring Identity", layer: "area44", status: "partial", notes: "Headers + verify path; hardware pending" },
	{ id: "crm", name: "Native CRM", layer: "ops", status: "active", api: "/api/crm/*" },
	{ id: "client-portal", name: "Client Portal + Workflows", layer: "ops", status: "active", api: "/api/portal/*" },
	{ id: "sales", name: "Sales (Quotes/Invoices)", layer: "ops", status: "active", api: "/api/suite/sales/*" },
	{ id: "marketing", name: "Marketing + Lead Sources", layer: "ops", status: "active", api: "/api/suite/marketing/*" },
	{ id: "traffic", name: "Traffic Attribution", layer: "ops", status: "active", api: "/api/suite/traffic" },
	{ id: "analytics", name: "Analytics Snapshot", layer: "ops", status: "active", api: "/api/suite/analytics" },
	{ id: "client-api", name: "Client API Access Tokens", layer: "ops", status: "active", api: "/api/suite/client-api/*" },
	{ id: "webhooks", name: "Outbound Webhooks (Zapier)", layer: "ops", status: "active" },
	{ id: "automation-engine", name: "CRM Automation Runner", layer: "ops", status: "active" },
	{ id: "email", name: "Transactional Email", layer: "ops", status: "partial", notes: "Interface ready; provider pending" },
	{ id: "shopify", name: "E-commerce (Shopify)", layer: "commerce", status: "external", notes: "Domain hosted; catalog pending" },
	{ id: "jhetti", name: "JHETTI / AeroSeek", layer: "jhetti", status: "planned", notes: "Assets pending CTO upload" },
	{ id: "notion-zapier", name: "Notion via Zapier", layer: "ops", status: "partial", notes: "Catch Hook path ready" },
];

export function systemsSummary() {
	const counts = { active: 0, partial: 0, planned: 0, external: 0 };
	for (const s of SYSTEMS_REGISTRY) counts[s.status]++;
	return {
		total: SYSTEMS_REGISTRY.length,
		counts,
		systems: SYSTEMS_REGISTRY,
		generatedAt: new Date().toISOString(),
	};
}
