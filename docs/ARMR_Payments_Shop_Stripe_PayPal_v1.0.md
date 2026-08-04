# Shop · Stripe · PayPal v1.0

**Product:** ARMR Product Engine $77 (ARMR-PE-COMPLETE)

## Shop Pay
Enable in Shopify Payments. Orders → /api/channels/ingest/shopify

## Stripe (Payment Links)
Product $77 · Webhook POST /api/payments/stripe/webhook  
Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

## PayPal (Payment Links)
$77 link · Webhook POST /api/payments/paypal/webhook  
Or Zapier → /api/channels/ingest/paypal

GET /api/payments/checklist for full steps.
