/**
 * Simple outbound webhook dispatcher.
 * Budget path: paste a Zapier Catch Hook URL into an automation action.
 * No subscription management required.
 */

export interface WebhookPayload {
	id: string;
	type: string;
	createdAt: string;
	apiVersion: "2026-08-01";
	data: Record<string, unknown>;
	context?: Record<string, unknown>;
}

export interface WebhookDispatchResult {
	ok: boolean;
	status?: number;
	error?: string;
	url: string;
	eventId: string;
}

/**
 * POST a JSON payload to a target URL (e.g. Zapier Catch Hook).
 * Fire-and-forget friendly: never throws; returns result object.
 */
export async function dispatchWebhook(
	targetUrl: string,
	type: string,
	data: Record<string, unknown>,
	context?: Record<string, unknown>,
	opts?: { secret?: string; timeoutMs?: number },
): Promise<WebhookDispatchResult> {
	const eventId = crypto.randomUUID();
	const payload: WebhookPayload = {
		id: eventId,
		type,
		createdAt: new Date().toISOString(),
		apiVersion: "2026-08-01",
		data,
		context,
	};

	if (!targetUrl || !targetUrl.startsWith("https://")) {
		return {
			ok: false,
			error: "targetUrl must be https",
			url: targetUrl || "",
			eventId,
		};
	}

	const controller = new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		opts?.timeoutMs ?? 8_000,
	);

	try {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			"User-Agent": "ARMR-ALEYE-Webhook/1.0",
			"X-ARMR-Event-Id": eventId,
			"X-ARMR-Event-Type": type,
		};
		if (opts?.secret) {
			headers["X-ARMR-Webhook-Secret"] = opts.secret;
		}

		const res = await fetch(targetUrl, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
			signal: controller.signal,
		});

		return {
			ok: res.ok,
			status: res.status,
			url: targetUrl,
			eventId,
			error: res.ok ? undefined : `HTTP ${res.status}`,
		};
	} catch (err) {
		return {
			ok: false,
			url: targetUrl,
			eventId,
			error: (err as Error).message || "dispatch failed",
		};
	} finally {
		clearTimeout(timeout);
	}
}
