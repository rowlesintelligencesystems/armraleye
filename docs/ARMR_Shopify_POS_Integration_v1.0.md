# Shopify POS Integration v1.0

**Product:** ARMR Product Engine ($77) · NFC ring roadmap  
**Mark:** Hand of Hamsa\u2122

## Enable
1. Sales channels → Point of Sale  
2. POS app on device  
3. Publish ARMR Product Engine to POS  
4. Require email for digital  
5. Webhook orders/paid → POST /api/channels/ingest/shopify_pos

## API
GET /api/channels/pos/checklist  
GET /api/channels/pos/config  
POST /api/channels/ingest/shopify_pos  
POST /api/channels/ingest/shopify (auto-detect POS)

## Fulfillment
send_digital_email · pick_physical · notify_crm
