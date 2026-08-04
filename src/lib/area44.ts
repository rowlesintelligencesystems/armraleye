/**
 * Area 44 — Inselligence layer
 *
 * Protected operational zone responsible for:
 * - Policy decision & enforcement (Zero Trust)
 * - Doctrine Number One monitoring
 * - NFC Ring identity
 * - Audit & lineage (persisted + encrypted at rest)
 * - Funding / value-capture surface (future)
 */

import {
	getAuditStats,
	persistAuditEvent,
	type AuditStoreEnv,
} from "./audit-store";
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
		auditPersistence: boolean;
		auditEncryption: boolean;
		nfcRingSupport: boolean;
	};
	audit?: {
		totalIndexed: number;
		maxEvents: number;
		ttlDays: number;
		encryptionEnabled: boolean;
	};
	version: string;
}

/** Return the current status of the Area 44 control plane. */
export async function getArea44Status(
	env?: AuditStoreEnv,
): Promise<Area44Status> {
	const encryptionEnabled = Boolean(env?.AUDIT_ENCRYPTION_KEY);

	const base: Area44Status = {
		zone: "Area 44",
		identity: "Inselligence",
		zeroTrust: true,
		controls: {
			identityVerification: true,
			doctrineMonitoring: true,
			policyEngine: true,
			auditLogging: true,
			auditPersistence: true,
			auditEncryption: encryptionEnabled,
			nfcRingSupport: true,
		},
		version: "0.3.0-zt-audit-enc",
	};

	if (env) {
		base.audit = await getAuditStats(env);
	}

	return base;
}

/**
 * Verify an identity presentation against Area 44.
 * Accepts NFC Ring headers or body payload.
 * Persists the resulting audit event (encrypted when key is set).
 */
export async function verifyArea44Identity(
	req: Request,
	body: Area44VerifyRequest | null,
	env: AuditStoreEnv,
	adminToken?: string,
): Promise<Area44VerifyResponse> {
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

	try {
		await persistAuditEvent(env, audit);
	} catch (err) {
		console.error("[Area44] audit persist failed:", (err as Error).message);
	}

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
 * Persists the resulting audit event (encrypted when key is set).
 */
export async function evaluateArea44Policy(
	req: Request,
	resource: string,
	resourceClass: ResourceClass,
	action: "read" | "write" | "execute" | "admin",
	env: AuditStoreEnv,
	adminToken?: string,
): Promise<Area44PolicyResponse> {
	const { result, audit } = zeroTrustGate(req, resource, resourceClass, action, {
		adminToken,
	});

	try {
		await persistAuditEvent(env, audit);
	} catch (err) {
		console.error("[Area44] audit persist failed:", (err as Error).message);
	}

	return {
		resource,
		resourceClass,
		action,
		decision: result,
		audit,
	};
}
