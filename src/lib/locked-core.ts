/**
 * ARMR ALEYE — Cryptographic lock + verification of core values + doctrine
 *
 * ARMR-POL-EPD-001: IMMUTABLE without explicit founding authorization.
 */

/** Canonical locked-core document (UTF-8, LF). Do not edit without explicit authorization. */
export const LOCKED_CORE_CANONICAL = `ARMR-ALEYE-LOCKED-CORE-v1
DOCTRINE_NUMBER_ONE: Seek God within
DOCTRINE_SEQUENCE:
1. Seek God within
2. Unconditional love
3. Understanding
4. Harmonic balance
5. Higher frequency / resonance
PHILOSOPHY: Values-aligned intelligent system; equal protection of people and systems; Hamsa as primary symbol of protection and awareness
ETHICS:
E1: Protection — Do not expose what is charged to protect — people or systems.
E2: Verification — No access without explicit, ongoing verification.
E3: Doctrine Fidelity — Identity is incomplete without alignment to Doctrine Number One and the Doctrine Sequence.
E4: Least Privilege — Access limited to what is required for the stated purpose.
E5: Auditability — Significant decisions leave a recoverable audit trail.
E6: Non-Capture of the Core — Area 44 / Inselligence shall not be sold, diluted, or subjected to silent takeover.
E7: Dignity in Automation — CRM, Portal, agents, and workflows shall not deceive or coerce.
E8: Proportional Power — Capability scales only with corresponding accountability.
POLICY_REF: ARMR-POL-EPD-001
`;

export const LOCKED_CORE_SHA256 =
	"acee30de584d770283933a04a4a5d7e040a0ea0707ef4fb7a7eaa6f81d71e8cd";

export const LOCKED_CORE_SHA512 =
	"f7c686fd8739931c32d088b77057b8a395fce25f6e3649405211005221d25f6b2c6225b87bbe0143f73fb227337a3a71cb567c86c3778b732c710fb06e691710";

export const LOCKED_CORE_META = {
	version: "1" as const,
	policy: "ARMR-POL-EPD-001",
	immutable: true as const,
	refinement: "zero without explicit founding authorization",
	doctrineNumberOne: "Seek God within",
} as const;

export class LockedCoreIntegrityError extends Error {
	readonly code = "LOCKED_CORE_INTEGRITY_FAILURE" as const;
	constructor(
		message: string,
		readonly details: {
			sha256: string;
			sha512: string;
			expectedSha256: string;
			expectedSha512: string;
		},
	) {
		super(message);
		this.name = "LockedCoreIntegrityError";
	}
}

async function digestHex(
	algorithm: "SHA-256" | "SHA-512",
	data: string,
): Promise<string> {
	const buf = new TextEncoder().encode(data);
	const hash = await crypto.subtle.digest(algorithm, buf);
	return [...new Uint8Array(hash)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

export interface LockedCoreVerification {
	ok: boolean;
	sha256: string;
	sha512: string;
	expectedSha256: string;
	expectedSha512: string;
	policy: string;
	doctrineNumberOne: string;
	immutable: true;
	verifiedAt: string;
}

/** Compute hashes of the canonical text and compare to published digests. */
export async function verifyLockedCore(): Promise<LockedCoreVerification> {
	const [sha256, sha512] = await Promise.all([
		digestHex("SHA-256", LOCKED_CORE_CANONICAL),
		digestHex("SHA-512", LOCKED_CORE_CANONICAL),
	]);

	const ok =
		sha256 === LOCKED_CORE_SHA256 && sha512 === LOCKED_CORE_SHA512;

	return {
		ok,
		sha256,
		sha512,
		expectedSha256: LOCKED_CORE_SHA256,
		expectedSha512: LOCKED_CORE_SHA512,
		policy: LOCKED_CORE_META.policy,
		doctrineNumberOne: LOCKED_CORE_META.doctrineNumberOne,
		immutable: true,
		verifiedAt: new Date().toISOString(),
	};
}

/**
 * Hard check: throws LockedCoreIntegrityError if hashes do not match.
 * Use when integrity failure must block the operation.
 */
export async function assertLockedCore(): Promise<LockedCoreVerification> {
	const result = await verifyLockedCore();
	if (!result.ok) {
		throw new LockedCoreIntegrityError(
			"Locked core hash verification failed — canonical values may have been altered without authorization",
			{
				sha256: result.sha256,
				sha512: result.sha512,
				expectedSha256: result.expectedSha256,
				expectedSha512: result.expectedSha512,
			},
		);
	}
	return result;
}

/** Soft check for status surfaces: never throws. */
export async function reportLockedCore(): Promise<LockedCoreVerification> {
	try {
		return await verifyLockedCore();
	} catch {
		return {
			ok: false,
			sha256: "",
			sha512: "",
			expectedSha256: LOCKED_CORE_SHA256,
			expectedSha512: LOCKED_CORE_SHA512,
			policy: LOCKED_CORE_META.policy,
			doctrineNumberOne: LOCKED_CORE_META.doctrineNumberOne,
			immutable: true,
			verifiedAt: new Date().toISOString(),
		};
	}
}
