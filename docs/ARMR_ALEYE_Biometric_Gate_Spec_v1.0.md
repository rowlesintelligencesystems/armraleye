# ARMR ALEYE — Biometric Gate Specification v1.0
Area 44 · Zero Trust Access Layer
The doctrine sequence is the architecture.

## Purpose
Access-control process: NFC possession, optional biometric, device binding, audit, least privilege. Not medical; not absolute-security guarantee.

## Doctrine
1. Seek God within
2. Unconditional love
3. Understanding
4. Harmonic balance
5. Higher frequency / resonance

## State machine
IDLE → CHALLENGE → VERIFY → GRANT | DENY → Audit; REVOKE forces deny until re-enroll.

## Factors
NFC ring/token · optional biometric (device-local preferred) · device binding · PIN for recovery only

## Audit
ENROLL_*, CHALLENGE_ISSUED, FACTOR_OK/FAIL, GRANT, DENY, REVOKE, SESSION_EXPIRE/LOGOUT

Spec ID: ARMR-AREA44-BIOGATE-SPEC-1.0
Copyright © 2026 ARMR ALEYE
