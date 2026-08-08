# ARMR ALEYE — MSOT
**Version:** 2026-08-07.11  
**Updated:** 2026-08-07T20:55:00-04:00  

> **Drive is full canonical** (this GitHub file may be tip-sized; open Drive MSOT_ARMR_ALEYE_2026-08-07.11.md for full text).

## LOCKED — Cloudflare Worker
| Field | Value |
|-------|--------|
| Worker name (ONLY) | `armraleyeapi-3-1` |
| Entry | `worker-deploy/cf-phone-ship/worker.js` |
| Version string | `3.1-trend-ppi` |
| Forbidden names | armraleye-api, armraleyeapi, armraleye |

Root wrangler.jsonc → phone-ship (not Hono). Backup: wrangler.hono.jsonc.bak

## Deploy next
1. Retry Deploy on `armraleyeapi-3-1`
2. Health → `3.1-trend-ppi`
3. `/api/memory/hard`
4. DIG-DOC QC $67/$67/$127

## Change log
**2026-08-07.11** Worker name lock; Hono root mis-entry fixed; skill cloudflare-workers 1.1; Running r15; Toolbox 1.5
**2026-08-07.10** Name lock tip
**2026-08-07.9** Hard Memory boot + /api/memory/hard

*Full MSOT on Google Drive*
