# PPI Real-time Signal Ingestion v1.0

## Endpoints
POST /api/ppi/ingest — single signal (auto-score + KV persist)
POST /api/ppi/ingest/batch — up to 50
GET /api/ppi/ingest/recent — last scored
GET /api/ppi/ingest/stream — SSE snapshot
GET /api/ppi/ingest/docs

## Auth
Authorization: Bearer PPI_INGEST_SECRET (or ADMIN_TOKEN)
Or ?token=

## Zapier
Any trigger → Webhooks POST → /api/ppi/ingest
Body: { "title": "...", "summary": "...", "adapter": "zapier" }

Whoppertunities optionally fire CHANNELS_ZAPIER_HOOK event ppi.whoppertunity
