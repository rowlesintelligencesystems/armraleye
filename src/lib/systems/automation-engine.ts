/**
 * CRM automation runner — evaluates rules and runs actions
 */
import { listAutomations, upsertTask } from "../crm-store";
import type { CrmStoreEnv } from "../crm-store";
import type { AutomationTrigger } from "../crm-types";
import { dispatchWebhook } from "../webhook-dispatch";

export async function runAutomations(
	env: CrmStoreEnv,
	trigger: AutomationTrigger,
	payload: Record<string, unknown>,
): Promise<{ matched: number; logs: string[] }> {
	const rules = await listAutomations(env);
	const logs: string[] = [];
	let matched = 0;

	for (const rule of rules) {
		if (!rule.enabled || rule.trigger !== trigger) continue;
		if (rule.conditions) {
			let ok = true;
			for (const [k, v] of Object.entries(rule.conditions)) {
				if (String(payload[k] ?? "") !== v) {
					ok = false;
					break;
				}
			}
			if (!ok) continue;
		}
		matched++;
		for (const action of rule.actions) {
			if (action.type === "webhook") {
				const url = String(action.config.url ?? "");
				const r = await dispatchWebhook(url, trigger, payload, {
					source: "crm-automation",
				});
				logs.push(
					r.ok
						? `rule=${rule.id} webhook ok ${r.status}`
						: `rule=${rule.id} webhook fail ${r.error}`,
				);
			} else if (action.type === "create_task") {
				await upsertTask(env, {
					title: String(action.config.title ?? `Automation: ${trigger}`),
					contactId:
						typeof payload.contactId === "string" ? payload.contactId : undefined,
					status: "open",
				});
				logs.push(`rule=${rule.id} task created`);
			} else if (action.type === "notify") {
				logs.push(`rule=${rule.id} notify (stub)`);
			} else {
				logs.push(`rule=${rule.id} action=${action.type} skipped`);
			}
		}
	}
	return { matched, logs };
}
