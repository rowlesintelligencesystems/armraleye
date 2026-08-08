# ARMR ALEYE API Worker 3.1 (phone Git deploy)

## Cloudflare settings (phone)

- Repo: `rowlesintelligencesystems/armraleye`
- **Path (no leading slash):** `worker-deploy/cf-phone-ship`
- **Build command:** leave EMPTY
- **Deploy command:** `npx wrangler deploy`
- package-lock.json included so `npm ci` succeeds

## After deploy

1. Domains → add `api.armraleye.com`
2. `https://api.armraleye.com/api/health` → `"version":"3.1-trend-ppi"`
3. `https://api.armraleye.com/api/memory/hard`

No hono. Zero runtime deps.
