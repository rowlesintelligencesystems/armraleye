/**
 * Transactional email interface — provider-agnostic
 */

export interface EmailMessage {
	to: string;
	subject: string;
	html?: string;
	text?: string;
	template?: string;
	data?: Record<string, unknown>;
}

export interface EmailResult {
	ok: boolean;
	provider: string;
	id?: string;
	error?: string;
}

export interface EmailEnv {
	EMAIL_PROVIDER?: string;
	EMAIL_API_KEY?: string;
	EMAIL_FROM?: string;
}

export async function sendEmail(
	env: EmailEnv,
	msg: EmailMessage,
): Promise<EmailResult> {
	if (!env.EMAIL_API_KEY) {
		console.log(
			`[email:stub] to=${msg.to} subject=${msg.subject} template=${msg.template ?? "-"}`,
		);
		return { ok: true, provider: "stub", id: `stub_${crypto.randomUUID()}` };
	}
	return {
		ok: false,
		provider: env.EMAIL_PROVIDER ?? "unset",
		error: "Provider adapter not configured for production key yet",
	};
}
