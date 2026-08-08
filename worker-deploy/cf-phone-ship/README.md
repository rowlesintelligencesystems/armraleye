# Phone Git deploy — ARMR ALEYE API 3.1

## Cloudflare settings

- Path: `worker-deploy/cf-phone-ship` (no leading slash)
- Build command: empty
- Deploy command: `npx wrangler deploy`
- **Worker name in dashboard MUST match wrangler.toml `name`**
  - Current: `armraleyeapi-3-1`

## Pre-deploy checks (agent must run)

1. package-lock.json present
2. `node --check worker.js`
3. `npm ci` succeeds
4. wrangler `name` == Cloudflare Worker project name

## After deploy

- Domains → `api.armraleye.com`
- Health: `https://api.armraleye.com/api/health` → `3.1-trend-ppi`
