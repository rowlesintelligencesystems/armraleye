# ARMR ALEYE — Master Source of Truth (MSOT)
**Version:** 2026-08-05.4  
**Updated:** 2026-08-05T19:53:00-05:00  
**Brand spelling (locked):** ARMR ALEYE  
**Commerce:** https://www.armraleye.com  
**API:** https://api.armraleye.com  
**Repo:** rowlesintelligencesystems/armraleye  

---

## 1. Doctrine (IMMUTABLE — no refinement without explicit owner authorization)

1. Seek God within  
2. Unconditional love  
3. Understanding  
4. Harmonic balance  
5. Higher frequency / resonance  

**The sequence is the architecture.**  
Doctrine number one never changes. Cryptographic hash verification on API `/api/doctrine`.

---

## 2. Claims boundary (all public outputs)

Educational / operational only.  
**Forbidden:** medical cure language; guaranteed income, rankings, or ROI; spiritual verification as a product output; publish without confirm gates.  
**Allowed:** checklists, field guides, workbooks, architecture manuals, transparent credits, opportunity literacy (whoopertunity/floppertunity as educational labels).

---

## 3. Company architecture (public)

```
ARMR ALEYE
├── Revenue Multiplication Engine (RME) — commercial umbrella
│   ├── Product Intelligence Engine (PIE) — core
│   ├── Profit Positioning Intelligence (PPI) — opportunity scoring
│   ├── Trend Engine — signal → score → placement
│   ├── Content Intelligence Engine (CIE)
│   ├── Architectural & Integration Intelligence (AIIE)
│   └── Packages / manuals / subscriptions
├── Access (adjacent): RRMSD gate · NFC ring concept · Zero Trust
└── Governance: doctrine · claims · brand lock (navy #0A0F1A · cyan #00E5FF)
```

**Internal codenames (e.g. Area 44) never appear in customer manuals or storefront copy.**

---

## 4. Live API (as of last verify)

| Field | Value |
|--------|--------|
| Host | https://api.armraleye.com |
| Last confirmed version | **2.1-scorer** (deploy **3.1-trend-ppi** from Drive to upgrade) |
| Engine label | Revenue Multiplication Engine |
| Core | PIE |
| Match scorer | LIVE — score, breakdown, confidence H/M/L, rewrite_flags |
| PPI | LIVE basic; **3.1** adds Drive 10-factor formula |

### Key routes
- `GET /api/health` · `/api/doctrine` · `/api/catalog` · `/api/entitlements` · `/api/systems` · `/api/completeness`
- `GET|POST /api/pie/detect` · `POST /api/pie/match` · `POST /api/pie/score` · `POST /api/pie/session`
- `POST /api/push` (confirm_push required)
- `POST /api/ppi/score` · `POST /api/ppi/signal` · `GET /api/trend/blueprint` (after 3.1)
- CIE: `/api/cie/blog|product-copy|manual|names|slogans|logo-brief|campaign`
- AIIE: `/api/aiie/architecture` · `/api/aiie/integration`

**Contracts:** match requires `confirm_scan:true`; push requires `confirm_push:true`; missing webhook secrets → `not_configured`.

---

## 5. Scoring models (LOCKED)

### 5.1 PIE match scorer
```
S = 0.15A + 0.25J + 0.25C + 0.10P + 0.10B + 0.15T − p
```
A=anchor quality · J=job fit · C=complementarity · P=platform fit · B=bundle clarity · T=title craft · p=claims penalty  
Confidence: H ≥0.75 · M ≥0.45 · else L.

### 5.2 PPI — Drive Scoring Formula.docx (LOCKED v1)
```
Total =
  Startup×0.10 + Time×0.15 + Monthly×0.15 + Automation×0.10
+ Passive×0.10 + Demand×0.10 + Competition×0.10 + Skill×0.10
+ Scalability×0.05 + Trend×0.05
```
Labels: whoopertunity · expansion · watch · pivot · floppertunity  
Placement windows: near_term · plan_quarter · monitor · hold · defer  

### 5.3 Trend Engine stages (Drive blueprint)
1 Signal Intake → 2 Signal Scoring → 3 Opportunity Mapping → 4 Product Generation → 5 Deployment Scheduling → 6 Feedback Loop.

### 5.4 Profit Positioning loop
Identify anchor work → extract missing components → build companion product → position as execution layer (complete, do not copy copyrighted works).

---

## 6. Product & subscription lineup (list references — confirm live Shopify)

| Offer | List ref. | Role |
|--------|-----------|------|
| PIE | $149/mo · 25 credits | Core detect/match/push |
| PIE Heavy | $249/mo · 40 credits | Higher volume |
| Engine Stack | $399/mo · 50 credits | Suite headroom |
| Members | $29/mo | Manual library |
| DIG-DOC-001 | $67 | Doctrine Architecture Manual |
| DIG-DOC-002 | $67 | PIE Operator Manual |
| DIG-DOC-003 | $127 | Milestone Payment Gate Handbook |
| ARMR-DIG-WVF-001 | $27 | Whoppertunity vs Flopportunity ebook |

Store: https://www.armraleye.com · Packages PDF on Drive with clickable links.

---

## 7. Brand lock

- Name: **ARMR ALEYE** only  
- Palette: navy `#0A0F1A`, cyan `#00E5FF`, teal `#00B8D4`  
- Marks: **Hand of Hamsa + Eye of Horus** (packaging / secondary; not sold as trademark product)  
- Wizard persona: **S'Cara** — locked avatar for all product concepts (no dark-entity imagery)  
- Ankh / Djed: mapped as supporting symbolism only when owner-approved  

### 7.1 Logo production standard (LOCKED 2026-08-05.4)

| Layer | Source of truth | Notes |
|-------|-----------------|--------|
| **Full circuit + Eye mark** | Hand-authored SVG | Preferred for production, manuals, Shopify |
| **Outer silhouette** | Optional auto-trace (Schneider outer clean / Potrace / VTracer `bw`) | Filled silhouette only; jump-filtered |
| **Transparent PNG** | Hard-edge extraction or SVG raster | Zero mid-alpha haze on white pages |
| **Forbidden for production** | Raw multi-pass internal auto-trace without cleanup | Causes contour jumps / scribbles |

**Tools researched (not required for production):**
- Schneider cubic Bézier fit (`schneider_fit.py`) — polyline → cubics  
- Contour jump filtering (step-length τ≈5× median, exploded-arm filter)  
- VTracer: presets `bw` / `poster` / `photo`; clustering `bw` | `color-cluster` | `watershed`; hierarchical `stacked` | `cutout`  

**Benchmark notes (external + project):** VTracer O(n); watershed re-cut ~25 ms on ~1.1 MP; simplify can cut SVG size ~40–65% on samples; logo-scale traces typically sub-second–few seconds.

---

## 8. Completeness (honest)

| Layer | ~% | Notes |
|--------|-----|--------|
| Edge API (after 3.1 deploy + secrets) | 90–95% | Formula + scorer + trend routes |
| Shopify native draft | 0% | Needs Admin API adapter |
| KV/D1 persistence | 0% | Credits, audit, CRM |
| External trend feeds | 0% | Manual signals only |
| CIE full LLM essay | Partial | Outlines/generators live |
| RRMSD hardware | Spec | Educational + NFC concept locked |
| Members auth portal | Spec | — |
| Brand vector pack | **Advanced** | Hand SVG + clean outer; extraction QC ongoing |

---

## 9. Deploy artifact (next operator action)
**Worker 3.1:** Drive `worker_trend_ppi_v3_1.js` → repo `src/index.js` → Cloudflare armraleyeapi Retry build → health `"version":"3.1-trend-ppi"`.

---

## 10. Document index (Drive)
- MSOT_Scoring_PPI_Trend_Integration_v1.md  
- ARMR_Systems_100pct_Audit_v1.md  
- ARMR_Completeness_AVV_RME_v1.md  
- schneider_fit.py · logo_icon_outer_clean.svg · logo_icon_schneider_*  
- DIG-DOC-002 PIE Operator Manual (latest PDF on Drive)  
- Executive Company Profile v2.x  

---

## 11. Change log (this version)

**2026-08-05.4**
- Brand §7.1 logo production standard locked (hand SVG primary; outer auto-trace optional)  
- Recorded Schneider fit + contour jump filtering research  
- Recorded VTracer presets, clustering, hierarchical modes, benchmark timing notes  
- S'Cara avatar remains locked for product concepts  

*End MSOT 2026-08-05.4*
