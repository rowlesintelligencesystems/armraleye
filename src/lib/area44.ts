/**
 * Area 44 — Inselligence layer
 *
 * Protected operational zone responsible for:
 * - Policy decision & enforcement (Zero Trust)
 * - Doctrine Number One monitoring
 * - NFC Ring identity
 * - Audit & lineage
 * - Funding / value-capture surface (future)
 */

import {
	type AuditEvent,
	type IdentityContext,
	type PolicyResult,
	type ResourceClass,
	zeroTrustGate,
} from "./zero-trust";

export interface Area44VerifyRequest {
	ringId?: string;
	doctrineOneStatus?: "compliant" | "non-compliant" | "unknown";
	deviceId?: string;
}

export interface Area44VerifyResponse {
	verified: boolean;
	identity: IdentityContext;
	policy: PolicyResult;
	audit: AuditEvent;
	message: string;
}

export interface Area44PolicyResponse {
	resource: string;
	resourceClass: ResourceClass;
	action: string;
	decision: PolicyResult;
	audit: AuditEvent;
}

export interface Area44Status {
	zone: "Area 44";
	identity: "Inselligence";
	zeroTrust: true;
	controls: {
		identityVerification: boolean;
		doctrineMonitoring: boolean;
		policyEngine: boolean;
		auditLogging: boolean;
		nfcRingSupport: boolean;
	};
	version: string;
}

/** Return the current status of the Area 44 control plane. */
export function getArea44Status(): Area44Status {
	return {
		zone: "Area 44",
		identity: "Inselligence",
		zeroTrust: true,
		controls: {
			identityVerification: true,
			doctrineMonitoring: true,
			policyEngine: true,
			auditLogging: true,
			nfcRingSupport: true, // interface ready; hardware integration pending
		},
		version: "0.1.0-zt",
	};
}

/**
 * Verify an identity presentation against Area 44.
 * Accepts NFC Ring headers or body payload.
 */
export function verifyArea44Identity(
	req: Request,
	body: Area44VerifyRequest | null,
	adminToken?: string,
): Area44VerifyResponse {
	// Prefer explicit body values when provided (for testing / future clients)
	const headers = new Headers(req.headers);
	if (body?.ringId) headers.set("x-armr-ring-id", body.ringId);
	if (body?.doctrineOneStatus === "compliant") {
		headers.set("x-armr-doctrine-one", "compliant");
	}
	if (body?.deviceId) headers.set("x-armr-device-id", body.deviceId);

	const synthetic = new Request(req.url, {
		method: req.method,
		headers,
	});

	const { result, audit, identity } = zeroTrustGate(
		synthetic,
		"/api/area44/verify",
		"area44-restricted",
		"read",
		{ adminToken },
	);

	const verified = result.decision === "allow";

	return {
		verified,
		identity,
		policy: result,
		audit,
		message: verified
			? "Identity accepted by Area 44 (Inselligence)"
			: `Identity rejected: ${result.reason}`,
	};
}

/**
 * Evaluate a policy decision for a given resource through Area 44.
 */
export function evaluateArea44Policy(
	req: Request,
	resource: string,
	resourceClass: ResourceClass,
	action: "read" | "write" | "execute" | "admin",
	adminToken?: string,
): Area44PolicyResponse {
	const { result, audit } = zeroTrustGate(req, resource, resourceClass, action, {
		adminToken,
	});

	return {
		resource,
		resourceClass,
		action,
		decision: result,
		audit,
	};
}
