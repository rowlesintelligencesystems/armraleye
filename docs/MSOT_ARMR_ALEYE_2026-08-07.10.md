# ARMR ALEYE — Master Source of Truth (MSOT)
**Version:** 2026-08-07.10  
**Updated:** 2026-08-07T20:50:00-04:00  
**Brand:** ARMR ALEYE  

> Drive full text is canonical when larger than GitHub tip.

## Identity
- Brand: **ARMR ALEYE**
- Commerce: https://www.armraleye.com (Shopify)
- API: https://api.armraleye.com
- Wizard: S'Cara
- Doctrine sequence is the architecture (immutable)

## LOCKED — Cloudflare Worker (2026-08-07.10)

| Field | Value |
|-------|--------|
| **Worker name (ONLY)** | `armraleyeapi-3-1` |
| Entry | `worker-deploy/cf-phone-ship/worker.js` |
| Target version string | `3.1-trend-ppi` |
| Root `wrangler.jsonc` / `wrangler.toml` | `main` → phone-ship worker; `name` → `armraleyeapi-3-1` |
| Forbidden names | armraleye-api, armraleyeapi, armraleye (this API ship) |

Full Hono suite config backed up as `wrangler.hono.jsonc.bak` when intentional restore is needed.

## Deploy next
1. Founder Retry Deploy on Worker **`armraleyeapi-3-1`** after GitHub name+jsonc fix
2. Verify `GET /api/health` → `"version":"3.1-trend-ppi"`
3. Verify `GET /api/memory/hard`
4. DIG-DOC QC locks $67 / $67 / $127

## Completeness (ops)
| Item | Status |
|------|--------|
| Phone-only / no large paste | LOCKED |
| Hard Memory boot | LOCKED |
| `/api/memory/hard` in worker package | Present |
| package-lock for Workers Builds | Present |
| Worker name single source | **`armraleyeapi-3-1` LOCKED 2026-08-07.10** |
| Root wrangler no longer points at Hono for 3.1 ship | Fixed 2026-08-07 |
| Live API still on old version until successful deploy | Expected |

## Change log

**2026-08-07.10**
- LOCK Worker name **`armraleyeapi-3-1`** only across wrangler.toml/jsonc + docs + cloudflare-workers skill v1.1
- Root cause documented: root `wrangler.jsonc` → Hono (`Could not resolve "hono"`)
- Root configs redirected to phone-ship `worker.js`
- Running File → r14
- Skill cloudflare-workers → 1.1

**2026-08-07.9**
- Hard Memory boot + `/api/memory/hard`; Toolbox 1.4

*End MSOT 2026-08-07.10*
