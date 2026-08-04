/**
 * Zero Trust controls for ARMR ALEYE.
 *
 * Core principles:
 * - Never trust, always verify
 * - Least privilege
 * - Continuous validation (Doctrine Number One + NFC Ring)
 * - Assume breach
 *
 * Area 44 / Inselligence is the policy decision & enforcement point.
 */

export type TrustDecision = "allow" | "deny" | "challenge";

export type ResourceClass =
	| "public"
	| "authenticated"
	| "doctrine-gated"
	| "area44-restricted"
	| "admin";

export interface IdentityContext {
	/** Stable subject identifier (from NFC Ring or other authenticator). */
	subjectId: string;
	/** Authentication method used for this request. */
	authMethod: "nfc-ring" | "bearer" | "web-bot-auth" | "none";
	/** Whether the NFC Ring presented a valid attestation. */
	ringVerified: boolean;
	/** Current Doctrine Number One compliance state. */
	doctrineOneCompliant: boolean;
	/** Optional device / context signals. */
	deviceId?: string;
	ip?: string;
	userAgent?: string;
	/** Timestamp of last continuous validation. */
	lastValidatedAt?: string;
}

export interface PolicyRequest {
	identity: IdentityContext;
	resource: string;
	resourceClass: ResourceClass;
	action: "read" | "write" | "execute" | "admin";
	context?: Record<string, unknown>;
}

export interface PolicyResult {
	decision: TrustDecision;
	reason: string;
	policyId: string;
	evaluatedAt: string;
	obligations?: string[];
}

export interface AuditEvent {
	id: string;
	timestamp: string;
	subjectId: string;
	resource: string;
	action: string;
	decision: TrustDecision;
	reason: string;
	policyId: string;
	metadata?: Record<string, unknown>;
}

/** Extract a best-effort identity context from the incoming request. */
export function extractIdentity(
	req: Request,
	opts?: { adminToken?: string },
): IdentityContext {
	const authHeader = req.headers.get("authorization") ?? "";
	const ringHeader = req.headers.get("x-armr-ring-id") ?? "";
	const doctrineHeader = req.headers.get("x-armr-doctrine-one") ?? "";
	const deviceHeader = req.headers.get("x-armr-device-id") ?? "";

	// NFC Ring path (future hardware integration)
	if (ringHeader) {
		return {
			subjectId: ringHeader,
			authMethod: "nfc-ring",
			ringVerified: true, // real verification will replace this
			doctrineOneCompliant: doctrineHeader.toLowerCase() === "compliant",
			deviceId: deviceHeader || undefined,
			ip: req.headers.get("cf-connecting-ip") ?? undefined,
			userAgent: req.headers.get("user-agent") ?? undefined,
			lastValidatedAt: new Date().toISOString(),
		};
	}

	// Bearer / admin token path
	if (authHeader.toLowerCase().startsWith("bearer ") && opts?.adminToken) {
		const token = authHeader.slice(7).trim();
		if (token === opts.adminToken) {
			return {
				subjectId: "admin",
				authMethod: "bearer",
				ringVerified: false,
				doctrineOneCompliant: true, // admin bypass for now
				ip: req.headers.get("cf-connecting-ip") ?? undefined,
				userAgent: req.headers.get("user-agent") ?? undefined,
				lastValidatedAt: new Date().toISOString(),
			};
		}
	}

	// Unauthenticated
	return {
		subjectId: "anonymous",
		authMethod: "none",
		ringVerified: false,
		doctrineOneCompliant: false,
		ip: req.headers.get("cf-connecting-ip") ?? undefined,
		userAgent: req.headers.get("user-agent") ?? undefined,
	};
}

/**
 * Evaluate a Zero Trust policy decision.
 * This is the core PDP (Policy Decision Point) for Area 44.
 */
export function evaluatePolicy(req: PolicyRequest): PolicyResult {
	const now = new Date().toISOString();
	const { identity, resourceClass, action } = req;

	// Public resources — always allow
	if (resourceClass === "public") {
		return {
			decision: "allow",
			reason: "Public resource",
			policyId: "zt-public-001",
			evaluatedAt: now,
		};
	}

	// Must have an identity beyond anonymous
	if (identity.authMethod === "none" || identity.subjectId === "anonymous") {
		return {
			decision: "deny",
			reason: "No verified identity (Zero Trust: never trust, always verify)",
			policyId: "zt-identity-001",
			evaluatedAt: now,
		};
	}

	// Doctrine-gated resources require Doctrine Number One compliance
	if (resourceClass === "doctrine-gated" || resourceClass === "area44-restricted") {
		if (!identity.doctrineOneCompliant) {
			return {
				decision: "deny",
				reason: "Doctrine Number One non-compliant",
				policyId: "zt-doctrine-001",
				evaluatedAt: now,
				obligations: ["revalidate-doctrine-one"],
			};
		}
	}

	// Area 44 restricted resources prefer NFC Ring verification
	if (resourceClass === "area44-restricted") {
		if (identity.authMethod !== "nfc-ring" && identity.authMethod !== "bearer") {
			return {
				decision: "challenge",
				reason: "Area 44 resource requires NFC Ring or elevated credential",
				policyId: "zt-area44-001",
				evaluatedAt: now,
				obligations: ["present-nfc-ring"],
			};
		}
	}

	// Admin actions require admin identity
	if (resourceClass === "admin" || action === "admin") {
		if (identity.subjectId !== "admin") {
			return {
				decision: "deny",
				reason: "Admin action requires admin identity",
				policyId: "zt-admin-001",
				evaluatedAt: now,
			};
		}
	}

	// Continuous validation freshness (soft check for now)
	if (identity.lastValidatedAt) {
		const ageMs = Date.now() - new Date(identity.lastValidatedAt).getTime();
		if (ageMs > 15 * 60 * 1000) {
			// 15 minutes
			return {
				decision: "challenge",
				reason: "Continuous validation window expired",
				policyId: "zt-continuous-001",
				evaluatedAt: now,
				obligations: ["reauthenticate"],
			};
		}
	}

	return {
		decision: "allow",
		reason: "Identity and policy checks passed",
		policyId: "zt-default-allow",
		evaluatedAt: now,
	};
}

/** Create a structured audit event for every policy decision. */
export function createAuditEvent(
	identity: IdentityContext,
	resource: string,
	action: string,
	result: PolicyResult,
	metadata?: Record<string, unknown>,
): AuditEvent {
	return {
		id: crypto.randomUUID(),
		timestamp: new Date().toISOString(),
		subjectId: identity.subjectId,
		resource,
		action,
		decision: result.decision,
		reason: result.reason,
		policyId: result.policyId,
		metadata,
	};
}

/**
 * High-level Zero Trust gate.
 * Returns the policy result and an audit event.
 */
export function zeroTrustGate(
	req: Request,
	resource: string,
	resourceClass: ResourceClass,
	action: PolicyRequest["action"],
	opts?: { adminToken?: string },
): { result: PolicyResult; audit: AuditEvent; identity: IdentityContext } {
	const identity = extractIdentity(req, opts);
	const result = evaluatePolicy({
		identity,
		resource,
		resourceClass,
		action,
	});
	const audit = createAuditEvent(identity, resource, action, result);
	return { result, audit, identity };
}
