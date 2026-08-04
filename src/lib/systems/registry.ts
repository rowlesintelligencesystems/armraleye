/** ARMR ALEYE — Systems Registry (finalized) */
export type SystemStatus = "active" | "partial" | "planned" | "external";
export interface SystemEntry {
  id: string;
  name: string;
  layer: "os" | "area44" | "jhetti" | "commerce" | "ops" | "intelligence";
  status: SystemStatus;
  path?: string;
  api?: string;
  notes?: string;
}
export const SYSTEMS_REGISTRY: SystemEntry[] = [
  { id: "agent-visibility", name: "Agent Visibility", layer: "os", status: "active", api: "/llms.txt" },
  { id: "marketing-site", name: "Marketing Site", layer: "os", status: "partial", path: "site/" },
  { id: "page-builder", name: "Page Builder", layer: "os", status: "active", api: "/api/builder/*" },
  { id: "zero-trust", name: "Zero Trust", layer: "area44", status: "active" },
  { id: "area44-control", name: "Area 44", layer: "area44", status: "active", api: "/api/area44/*" },
  { id: "audit-store", name: "Audit Persistence", layer: "area44", status: "active" },
  { id: "audit-crypto", name: "Audit Encryption", layer: "area44", status: "active" },
  { id: "locked-core", name: "Locked Core", layer: "area44", status: "active", api: "/api/area44/locked-core" },
  { id: "nfc-identity", name: "NFC Ring", layer: "area44", status: "partial" },
  { id: "command-center", name: "Command Center", layer: "ops", status: "active", api: "/api/command-center" },
  { id: "crm", name: "Native CRM", layer: "ops", status: "active", api: "/api/crm/*" },
  { id: "client-portal", name: "Client Portal", layer: "ops", status: "active", api: "/api/portal/*" },
  { id: "sales", name: "Sales", layer: "ops", status: "active", api: "/api/suite/sales/*" },
  { id: "marketing", name: "Marketing", layer: "ops", status: "active", api: "/api/suite/marketing/*" },
  { id: "traffic", name: "Traffic", layer: "ops", status: "active" },
  { id: "analytics", name: "Analytics", layer: "ops", status: "active" },
  { id: "client-api", name: "Client API", layer: "ops", status: "active" },
  { id: "webhooks", name: "Webhooks", layer: "ops", status: "active" },
  { id: "automation-engine", name: "Automation Runner", layer: "ops", status: "active" },
  { id: "email", name: "Email", layer: "ops", status: "partial" },
  { id: "tool-synter", name: "Tool Synter", layer: "ops", status: "active" },
  { id: "unity-cycle", name: "Unity Cycle", layer: "ops", status: "active" },
  { id: "ppi", name: "Profit Positioning Intelligence", layer: "intelligence", status: "active", api: "/api/ppi/*" },
  { id: "trend-engine", name: "Trend Engine", layer: "intelligence", status: "active", api: "/api/ppi/signals" },
  { id: "opportunity-engine", name: "Opportunity Engine", layer: "intelligence", status: "active", api: "/api/ppi/opportunities" },
  { id: "shopify", name: "Shopify", layer: "commerce", status: "external" },
  { id: "shopify-pos", name: "Shopify POS", layer: "commerce", status: "active", api: "/api/channels/pos/*" },
  { id: "channels", name: "Multi-Channel Sales", layer: "commerce", status: "active", api: "/api/channels/*" },
  { id: "payments", name: "Stripe PayPal Shop Pay", layer: "commerce", status: "active", api: "/api/payments/*" },
  { id: "product-engine", name: "ARMR Product Engine", layer: "commerce", status: "active" },
  { id: "jhetti", name: "JHETTI", layer: "jhetti", status: "planned" },
  { id: "notion-zapier", name: "Notion Zapier", layer: "ops", status: "partial" },
];
export function systemsSummary() {
  const counts = { active: 0, partial: 0, planned: 0, external: 0 };
  for (const s of SYSTEMS_REGISTRY) counts[s.status]++;
  return { total: SYSTEMS_REGISTRY.length, counts, systems: SYSTEMS_REGISTRY, generatedAt: new Date().toISOString(), finalized: true };
}
