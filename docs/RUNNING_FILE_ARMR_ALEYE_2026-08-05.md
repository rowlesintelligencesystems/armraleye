# ARMR ALEYE — Running File
**Updated:** 2026-08-05T19:53:00-05:00  
**Companion to:** MSOT 2026-08-05.4  

---

## Session arc (condensed)

1. Homepage mockup → Shopify + Cloudflare Worker API on api.armraleye.com  
2. Doctrine sequence locked immutable; hash on API  
3. Zero Trust · audit · CRM stubs · confirm gates  
4. PIE: detect → match → push; platform detection; Zapier Catch Hooks  
5. Match scorer v1 LIVE on 2.1-scorer (score/breakdown/confidence)  
6. RME named as commercial umbrella  
7. DIG-DOC-002 iterated (executive profile, packages, density, brand appendix)  
8. CIE designed (blog/copy/names/slogans/logo-brief/campaign)  
9. Drive scan: Trend Engine, PPI, Scoring Formula.docx, Whoppertunity ebook  
10. Integrated Drive 10-factor formula into PPI; Trend routes; PIE session + PPI  
11. MSOT + 100% audit; worker_trend_ppi_v3_1.js on Drive  
12. **Brand graphics / vectorization track (2026-08-05 evening)**  
    - Schneider cubic Bézier algorithm implemented (`schneider_fit.py`)  
    - Contour extract from `logo_icon_primary.jpg`; multi-pass fits  
    - Contour **jump artifacts** diagnosed (unordered internal strokes)  
    - **Clean outer silhouette** only (filled + angular sort + jump filter)  
    - Jump-filtering algorithms surveyed (step-length, spike, RDP, morph fill)  
    - Vectorization tools surveyed (Potrace, VTracer, Illustrator, AI tracers)  
    - VTracer: presets bw/poster/photo; clustering bw|color-cluster|watershed; hierarchical stacked|cutout  
    - Performance notes: O(n); watershed re-cut ~25 ms; simplify file-size cuts  
    - **Production lock:** hand-authored SVG for full circuit mark; outer auto-trace optional  

---

## Last verified live

```
GET https://api.armraleye.com/api/health
→ version 2.1-scorer, engine Revenue Multiplication Engine, match_scorer feature
```

Match fixture: NFC Access Ring → score ~0.928 confidence H.

---

## Brand assets (vector track)

| Asset | Status | Location |
|-------|--------|----------|
| `schneider_fit.py` | Implemented + demos | artifacts/docs/graphics + Drive |
| `logo_icon_outer_clean.svg` | Clean outer only | Drive |
| Schneider v2 multi-pass | Experimental (internals noisy) | Drive — not production |
| Hand-authored logo SVG | **Production** | Brand pack / prior Drive |
| Transparent / hard-edge PNG QC | Iterative | Drive proofs |

---

## Pending operator actions

1. Deploy `worker_trend_ppi_v3_1.js` as src/index.js → Retry build  
2. Confirm health `3.1-trend-ppi`  
3. Set WEBSITE_WEBHOOK_URL / SOCIAL_WEBHOOK_URL if not set  
4. Align Shopify product handles with packages PDF links  
5. Optional: KV for credits/audit; Shopify Admin token for drafts  
6. Optional: install VTracer locally and time `bw` / `poster` on official icon  
7. Confirm production logo pack (hand SVG + transparent PNGs) on all storefront surfaces  

---

## Decisions locked this period

- Brand ARMR ALEYE; doctrine immutable; Area 44 not in customer materials  
- Claims boundary on all engine outputs  
- Revenue Multiplication Engine = umbrella name  
- Scoring Formula.docx weights = PPI v1 locked  
- Complementary digitals preferred over substitutes  
- Upsell with clarity, not pressure  
- **Logo:** hand SVG = production circuit mark; auto-trace = outer silhouette experiments only  
- **S'Cara** avatar locked for product concept imagery  
- Hand of Hamsa + Eye of Horus naming retained  

---

## Next recommended (after deploy)

1. Smoke-test `/api/ppi/score` with full 10 factors  
2. Smoke-test `/api/pie/session` with inventory + signals  
3. Publish WVF ebook listing if not live  
4. KV design for credit ledger  
5. Package final logo ZIP (SVG + hard PNG icon/horizontal/vertical) for Shopify brand settings  

---

## Research log (non-blocking)

- Contour jump filtering: step τ≈5× median; exploded Bézier arms; fill-holes before trace  
- VTracer hierarchical: stacked = compact overdraw; cutout = seam-free mosaic  
- Benchmarks: project watershed re-cut ~25 ms (1400×775); third-party tool times vary 1–45 s  

*End Running File*
