# ARMR ALEYE — Running File
**Revision:** r14  
**Date:** 2026-08-07T20:50:00-04:00  
**MSOT:** 2026-08-07.10  

## Session focus
1. Cloudflare Workers Builds: Install fixed (package-lock); Deploy failed on Hono entry from root `wrangler.jsonc`.
2. Locked **one** Worker name: `armraleyeapi-3-1`.
3. Redirected root wrangler.jsonc/toml to `worker-deploy/cf-phone-ship/worker.js`.
4. Updated cloudflare-workers skill v1.1 + MSOT .10.

## Locked table
| Item | Status |
|------|--------|
| Worker name | **`armraleyeapi-3-1` ONLY** |
| Version target | `3.1-trend-ppi` |
| Phone-only / no large paste | LOCKED |
| Preflight before Retry Deploy | LOCKED |
| Hono not used for 3.1 phone ship | LOCKED |

## Next actions
1. Founder: Retry Deploy on `armraleyeapi-3-1`
2. Confirm health `3.1-trend-ppi` + `/api/memory/hard`
3. DIG-DOC QC

*End Running File r14*
