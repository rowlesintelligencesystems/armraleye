# ARMR ALEYE — Running File
**Revision:** r15  
**Date:** 2026-08-07T20:55:00-04:00  
**MSOT:** 2026-08-07.11  

## Session focus
1. COLLECT → UPDATE Master cycle after Cloudflare 3.1 ship work.
2. Locked single Worker name `armraleyeapi-3-1`; fixed root wrangler.jsonc Hono mis-entry.
3. cloudflare-workers skill v1.1; Hard Memory name lock; preflight-before-Retry rule.

## Locked table
| Item | Status |
|------|--------|
| Worker name | **armraleyeapi-3-1 ONLY** |
| Entry | worker-deploy/cf-phone-ship/worker.js |
| Version target | 3.1-trend-ppi |
| Phone-only / no large paste | LOCKED |
| Preflight before Retry Deploy | LOCKED |
| Root wrangler not Hono for 3.1 ship | Fixed |
| DIG-DOC prices | $67 / $67 / $127 |
| Doctrine / sequence architecture | Immutable |

## Status
| Item | Status |
|------|--------|
| package-lock / Install step | Done (works) |
| Deploy 3.1 live | Pending founder Retry |
| Live health still pre-3.1 until deploy | Expected |
| Hono full suite | Parked in wrangler.hono.jsonc.bak |

## Next actions
1. Retry Deploy on **armraleyeapi-3-1**
2. Confirm health `3.1-trend-ppi` + `/api/memory/hard`
3. DIG-DOC QC locks

*End Running File r15*
