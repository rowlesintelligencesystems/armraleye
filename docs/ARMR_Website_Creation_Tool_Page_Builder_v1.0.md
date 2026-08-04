# ARMR Website Creation Tool + Page Builder v1.0

**Engine:** ENG-WCT  
**Pattern:** PAT-021  
**Product default:** ARMR Product Engine  
**Packaging mark:** Hand of Hamsa™  

## Components
1. Website Creation Tool — project from brief
2. Page Builder — block editor (hero, trinity, product, features, CTA, FAQ, image, HTML)
3. HTML renderer (void-dark)
4. Shopify section JSON export

## Paths
- `src/lib/systems/page-builder.ts`
- `src/worker/builder-routes.ts` → mount at `/api/builder`
- `site/page-builder.html`

## API
GET /api/builder/catalog  
POST /api/builder/projects (admin)  
GET /api/builder/projects/:id/pages/:slug/html  
POST /api/builder/projects/:id/pages/:slug/blocks (admin)  
GET /api/builder/shopify/export/:type  

## Budget
No Webflow required. Memory storage in dev; KV next. Shopify export for theme sections.
