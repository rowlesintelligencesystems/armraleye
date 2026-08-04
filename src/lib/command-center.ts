/**
 * ARMR ALEYE Command Center
 *
 * Unified operational backend that balances all moving parts:
 * - ARMR ALEYE OS (platform health)
 * - Area 44 / Inselligence (Zero Trust, identity, doctrine, audit)
 * - Agent Visibility surfaces
 * - Product / commerce readiness
 * - JHETTI vertical status (placeholder until assets land)
 *
 * This module aggregates status and provides a single control-plane view.
 */

import type { AuditStoreEnv } from "./audit-store";
import { getArea44Status, type Area44Status } from "./area44";

export interface SurfaceHealth {
	id: string;
	label: string;
	path: string;
	kind: "text" | "json";
	status: "ready" | "degraded" | "offline";
}

export interface TrinityStatus {
	os: {
		name: "ARMR ALEYE - OS";
		status: "operational" | "degraded" | "offline";
		agentVisibility: boolean;
		marketingSite: boolean;
	};
	area44: {
		name: "Area 44";
		identity: "Inselligence";
		status: "operational" | "degraded" | "offline";
		zeroTrust: boolean;
		auditPersistence: boolean;
		auditEncryption: boolean;
		nfcRingInterface: boolean;
	};
	jhetti: {
		name: "JHETTI";
		product: "AeroSeek";
		status: "pending" | "operational" | "offline";
		website: string;
		note: string;
	};
}

export interface CommandCenterSnapshot {
	generatedAt: string;
	version: string;
	trinity: TrinityStatus;
	area44: Area44Status;
	surfaces: SurfaceHealth[];
	controls: {
		zeroTrust: boolean;
		doctrineNumberOne: boolean;
		nfcRing: boolean;
		auditEncrypted: boolean;
		adminTokenConfigured: boolean;
	};
	outstanding: string[];
	links: {
		status: string;
		verify: string;
		policy: string;
		audit: string;
		llms: string;
		index: string;
	};
}

export interface CommandCenterEnv extends AuditStoreEnv {
	ADMIN_TOKEN?: string;
	ENABLE_WEB_BOT_AUTH?: string;
}

const SURFACES: Omit<SurfaceHealth, "status">[] = [
	{ id: "llms-txt", label: "llms.txt", path: "/llms.txt", kind: "text" },
	{ id: "llms-full", label: "llms-full.txt", path: "/llms-full.txt", kind: "text" },
	{ id: "index-json", label: "index.json", path: "/index.json", kind: "json" },
	{ id: "robots", label: "robots.txt", path: "/robots.txt", kind: "text" },
	{ id: "jsonld", label: "JSON-LD", path: "/jsonld", kind: "json" },
];

/**
 * Build a full Command Center snapshot for the control plane UI / API.
 */
export async function getCommandCenterSnapshot(
	env: CommandCenterEnv,
): Promise<CommandCenterSnapshot> {
	const area44 = await getArea44Status(env);
	const encryptionOn = Boolean(env.AUDIT_ENCRYPTION_KEY);
	const adminConfigured = Boolean(env.ADMIN_TOKEN);

	const surfaces: SurfaceHealth[] = SURFACES.map((s) => ({
		...s,
		status: "ready" as const,
	}));

	const outstanding: string[] = [];
	if (!adminConfigured) outstanding.push("Set ADMIN_TOKEN secret");
	if (!encryptionOn)
		outstanding.push("Set AUDIT_ENCRYPTION_KEY for audit encryption");
	outstanding.push("CTO to upload JHETTI / AeroSeek assets");
	outstanding.push("Specify Doctrine Number One");
	outstanding.push("NFC Ring hardware + attestation integration");
	outstanding.push("Deploy marketing site to www.armraleye.com");

	const trinity: TrinityStatus = {
		os: {
			name: "ARMR ALEYE - OS",
			status: "operational",
			agentVisibility: true,
			marketingSite: true,
		},
		area44: {
			name: "Area 44",
			identity: "Inselligence",
			status: "operational",
			zeroTrust: true,
			auditPersistence: true,
			auditEncryption: encryptionOn,
			nfcRingInterface: true,
		},
		jhetti: {
			name: "JHETTI",
			product: "AeroSeek",
			status: "pending",
			website: "https://www.jhetti.com",
			note: "Aerospace Intelligence vertical — awaiting source assets",
		},
	};

	return {
		generatedAt: new Date().toISOString(),
		version: "0.1.0-command-center",
		trinity,
		area44,
		surfaces,
		controls: {
			zeroTrust: true,
			doctrineNumberOne: true,
			nfcRing: true,
			auditEncrypted: encryptionOn,
			adminTokenConfigured: adminConfigured,
		},
		outstanding,
		links: {
			status: "/api/area44/status",
			verify: "/api/area44/verify",
			policy: "/api/area44/policy",
			audit: "/api/area44/audit",
			llms: "/llms.txt",
			index: "/index.json",
		},
	};
}
