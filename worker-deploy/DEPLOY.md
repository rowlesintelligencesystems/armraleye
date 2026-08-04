# Deploy ARMR Worker

1. cd worker-deploy && npm install
2. npx wrangler login
3. npx wrangler kv namespace create VISIBILITY_CACHE → paste id in wrangler.toml
4. npx wrangler secret put ADMIN_TOKEN
5. npx wrangler secret put INGEST_SECRET
6. npx wrangler deploy
7. curl https://armraleye.<subdomain>.workers.dev/api/health
