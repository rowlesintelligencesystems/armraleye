# ARMR ALEYE — Locked Core Cryptographic Hashes

**Policy:** ARMR-POL-EPD-001  
**Status:** IMMUTABLE — zero refinement without explicit founding authorization  
**Code:** `src/lib/locked-core.ts`

## Doctrine Number One

**Seek God within.**

## Published hashes (canonical UTF-8, LF)

| Algorithm | Digest |
|-----------|--------|
| **SHA-256** | `acee30de584d770283933a04a4a5d7e040a0ea0707ef4fb7a7eaa6f81d71e8cd` |
| **SHA-512** | `f7c686fd8739931c32d088b77057b8a395fce25f6e3649405211005221d25f6b2c6225b87bbe0143f73fb227337a3a71cb567c86c3778b732c710fb06e691710` |

**Byte length:** 1093  
**Encoding:** UTF-8  
**Newlines:** LF

## What is hashed

- Doctrine Number One  
- Full Doctrine Sequence (1–5)  
- Philosophy (values-aligned intelligent system; equal protection; Hamsa)  
- Ethics pillars E1–E8  
- Policy reference ARMR-POL-EPD-001  

## Verification

```ts
import { verifyLockedCore } from "./lib/locked-core";
const result = await verifyLockedCore();
// result.ok === true when canonical text matches published hashes
```

Any edit to the canonical string without updating hashes (and without explicit authorization) will make `ok` false.

## API (recommended surface)

`GET /api/area44/locked-core` or include in Command Center / Area 44 status.
