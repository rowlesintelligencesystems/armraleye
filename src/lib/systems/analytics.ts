/**
 * Analytics aggregation across CRM, Sales, Portal, Traffic
 */
import { getCrmSnapshot, type CrmStoreEnv } from "../crm-store";
import { listPortalAccounts, type PortalStoreEnv } from "../client-portal";
import { salesSnapshot } from "./sales";
import { listTraffic, listCampaigns } from "./marketing";

export async function getAnalyticsSnapshot(env: CrmStoreEnv & PortalStoreEnv) {
	const [crm, sales, traffic, campaigns, portals] = await Promise.all([
		getCrmSnapshot(env),
		salesSnapshot(env),
		listTraffic(env, 100),
		listCampaigns(env),
		listPortalAccounts(env, 100, 0),
	]);

	const portalByStage: Record<string, number> = {};
	for (const p of portals) {
		portalByStage[p.workflowStage] = (portalByStage[p.workflowStage] ?? 0) + 1;
	}

	const trafficBySource: Record<string, number> = {};
	for (const t of traffic) {
		trafficBySource[t.source] = (trafficBySource[t.source] ?? 0) + 1;
	}

	return {
		crm: crm.counts,
		pipeline: crm.pipeline,
		sales,
		portal: { total: portals.length, byStage: portalByStage },
		marketing: {
			campaigns: campaigns.length,
			activeCampaigns: campaigns.filter((c) => c.status === "active").length,
			trafficEvents: traffic.length,
			trafficBySource,
		},
		generatedAt: new Date().toISOString(),
	};
}
