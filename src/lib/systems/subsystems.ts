export type SubStatus = "active" | "partial" | "planned" | "external";
export interface Subsystem { id: string; name: string; systemId: string; status: SubStatus; sku?: string; api?: string; notes?: string; }
export const SUBSYSTEMS: Subsystem[] = [
  { id: "SUB-OS-BUILDER", name: "Page Builder", systemId: "SYS-OS-01", status: "active", api: "/api/builder/*" },
  { id: "SUB-PIE-PKG", name: "PIE Complete", systemId: "SYS-OS-02", status: "active", sku: "ARMR-PIE-COMPLETE" },
  { id: "SUB-PIE-SUB-M", name: "PIE Monthly", systemId: "SYS-OS-02", status: "active", sku: "ARMR-PIE-SUB-M" },
  { id: "SUB-DIG-MILE", name: "Milestone Payment Gates", systemId: "SYS-OS-03", status: "active", sku: "ARMR-DIG-MILE-001" },
  { id: "SUB-ZT-ENG", name: "Zero Trust Engine", systemId: "SYS-A44-01", status: "active" },
  { id: "SUB-AUD-LOCK", name: "Locked Core", systemId: "SYS-A44-02", status: "active" },
  { id: "SUB-PPI-INGEST", name: "PPI Realtime Ingest", systemId: "SYS-ENG-01", status: "active", api: "/api/ppi/*" },
  { id: "SUB-CC-DASH", name: "Command Center", systemId: "SYS-OPS-01", status: "active" },
  { id: "SUB-CRM-PIPE", name: "CRM Pipeline", systemId: "SYS-OPS-02", status: "active" },
  { id: "SUB-PAY-MILE", name: "Milestone Gates", systemId: "SYS-COM-02", status: "active" },
  { id: "SUB-CH-API", name: "Channels API", systemId: "SYS-COM-03", status: "active", api: "/api/channels" },
  { id: "SUB-MILE-ENT", name: "Strategies E1-E7", systemId: "SYS-MILE-01", status: "active" },
  { id: "SUB-GOV-MSOT", name: "MSOT", systemId: "SYS-GOV-01", status: "active" },
];
export function subsystemsSummary() {
  const counts = { active: 0, partial: 0, planned: 0, external: 0 };
  for (const s of SUBSYSTEMS) counts[s.status]++;
  return { total: SUBSYSTEMS.length, counts, generatedAt: new Date().toISOString() };
}
