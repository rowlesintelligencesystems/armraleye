# ARMR Product Intelligence Engine — Architecture Manual

**Document ID:** ARMR-DIG-PIE-ARCH-001  
**Title:** Product Intelligence Engine Architecture Manual  
**Version:** 1.0  
**Status:** LOCKED  
**Effective:** 2026-08-05  
**Owner:** ARMR ALEYE LLC  
**Umbrella:** Revenue Multiplication Engine (RME)  

**PDF (executive edition):** https://drive.google.com/file/d/1Ac7Um3l15udE48-YijxdHpCSGdrB2l6p/view?usp=drivesdk  

**Companion documents:**  
- MSOT 2026-08-05.5  
- System Architecture Manual ARMR-DIG-SAGM-001  
- PEIE ARMR-ENG-PEIE-001  
- Competitor Ecosystem Mapping ARMR-ENG-PEIE-CEM-001  
- S'Cara Official Product & Brand Manual  
- Grok Profile Lock ARMR-BRAND-GROK-001  

---

## 1. Purpose of This Manual

This is the definitive architecture manual for the **Product Intelligence** family of engines inside ARMR ALEYE.  

It consolidates everything built and locked across the day:

- Product Intelligence Engine (PIE)  
- Product Ecosystem Intelligence Engine (PEIE)  
- Competitor Ecosystem Mapping  
- Relationship to the locked S'Cara brand system, Protective Emblem, and Grok dual-branding  
- Scoring models, API surface, governance, and completeness  

It is educational and operational. It does not make medical, income, ranking, or spiritual-verification claims.

---

## 2. Engine Family Topology

```
Revenue Multiplication Engine (RME)
│
├── Product Intelligence Engine (PIE)
│     └── Single-product detect → match → score → push
│
├── Product Ecosystem Intelligence Engine (PEIE)
│     ├── Catalog Graph (own products)
│     ├── Relationship Scoring
│     ├── Gap Detection
│     ├── Lifecycle Stage
│     ├── Multiplication Paths
│     ├── Ecosystem Health
│     └── Competitor Ecosystem Mapping
│
├── Profit Positioning Intelligence (PPI)     ← opportunity scoring (feeds both)
├── Trend Engine                             ← signal intake (feeds both)
├── Content Intelligence Engine (CIE)
├── Architectural & Integration Intelligence (AIIE)
└── Packages / Manuals / Subscriptions
```

**PIE** answers: “What is the best next product action for this specific input?”  
**PEIE** answers: “How does the entire catalog and competitive landscape relate, and where are the safe multiplication opportunities?”

---

## 3. Product Intelligence Engine (PIE) — Core Architecture

### 3.1 Mission
Detect product opportunities, match them to the ARMR catalog or external signals, score fit, and push only when explicit confirmation gates are satisfied.

### 3.2 Core Flow
```
Input Signal / Inventory / Description
        ↓
   DETECT  (normalize, extract anchors, platform signals)
        ↓
   MATCH   (catalog + complementary scoring)
        ↓
   SCORE   (PIE match formula)
        ↓
   SESSION (optional multi-turn context)
        ↓
   PUSH    (requires confirm_push:true)
```

### 3.3 Locked Scoring Model
```
S = 0.15A + 0.25J + 0.25C + 0.10P + 0.10B + 0.15T − p
```
- A = Anchor quality  
- J = Job fit  
- C = Complementarity  
- P = Platform fit  
- B = Bundle clarity  
- T = Title craft  
- p = Claims penalty  

Confidence bands: **H ≥ 0.75 · M ≥ 0.45 · else L**

### 3.4 Contracts
- Match requires `confirm_scan:true`  
- Push requires `confirm_push:true`  
- Missing webhook secrets → `not_configured`  
- All outputs remain inside the claims boundary  

### 3.5 Key Routes (current)
- `POST /api/pie/detect`  
- `POST /api/pie/match`  
- `POST /api/pie/score`  
- `POST /api/pie/session`  
- `POST /api/push`  

---

## 4. Product Ecosystem Intelligence Engine (PEIE) — Architecture

### 4.1 Mission
Treat the full ARMR product landscape as a living ecosystem rather than isolated SKUs. Map relationships, detect gaps, score complementarity, and recommend claims-safe multiplication paths.

### 4.2 Core Capabilities (Locked v1)
| Capability | Description |
|------------|-------------|
| Catalog Graph | Live map of active SKUs, type, price band, status |
| Relationship Scoring | Complementary strength, substitute risk, bundle affinity |
| Gap Detection | Missing companion products that complete a customer journey |
| Lifecycle Stage | Intro / Growth / Mature / Harvest / Sunset |
| Multiplication Paths | Next products or bundles that increase lifetime value without claims risk |
| Ecosystem Health | Coverage, density, attachment potential score |
| Competitor Ecosystem Mapping | Structured observation of external product landscapes |

### 4.3 Key Concepts
- **Anchor Product** — primary entry purchase  
- **Companion Product** — high-complementarity digital that completes the job  
- **Bundle Gravity** — strength of cross-sell pull  
- **Claims-Safe Multiplication** — growth recommendations that stay educational/operational  
- **S'Cara Bridge** — which locked brand assets and manuals best support a given path  

### 4.4 Status
Definition and position: **LOCKED**.  
Catalog graph, scoring formula, and API surface: Spec (next build layer).

---

## 5. Competitor Ecosystem Mapping (PEIE-CEM)

### 5.1 Mission
Systematically observe relevant competitor product landscapes to surface white-space gaps and differentiation opportunities while remaining strictly claims-safe.

### 5.2 Mapping Dimensions
- Anchor Offers  
- Companion / Upsell Layer  
- Bundle Gravity  
- Price Band & Access Model  
- Claims Style (educational vs aggressive)  
- Visual / Persona Layer  
- Gap / Weakness Signals  
- Lifecycle Stage  

### 5.3 Process
1. Select 3–7 relevant competitors  
2. Capture anchors and companions  
3. Tag complementary / substitute relationships relative to ARMR catalog  
4. Note claims posture  
5. Extract gaps  
6. Feed gaps into PEIE multiplication recommendations  
7. Refresh only on material change  

### 5.4 Outputs
- Competitor Snapshot Cards  
- Ecosystem Overlay  
- Prioritized Gap List  
- Differentiation Notes (S'Cara, Hamsa, Doctrine, Architecture Manual)  
- Watch List  

### 5.5 Governance
Public information only. No ranking language, no attack framing, no private data. All recommendations stay inside the ARMR claims boundary.

---

## 6. Brand & Persona Integration

The Product Intelligence family is visually and tonally anchored by the locked brand system built today:

| Element | Status | Role in PIE / PEIE |
|---------|--------|--------------------|
| **S'Cara** | LOCKED | Primary wizard persona & Product #1 visual identity. Execution companion. |
| **Winged-S Logo + Halo** | LOCKED | Primary mark for all product intelligence surfaces |
| **Hand of Hamsa + Eye of Horus** | LOCKED | Protective secondary emblem (cyan / gold / hybrid / minimal) |
| **Grok** | LOCKED | Dual-branding persona (cybernetic executive + cyan halo) |
| **Palette** | LOCKED | Navy #0B1C2E · Gold #C9A84C · Ivory #F5F0E6 · Cyan #00E5FF |
| **S'Cara Product & Brand Manual** | LOCKED | Complete visual + product identity reference |
| **System Architecture Manual** | LOCKED | Overall platform topology |

PEIE’s “S'Cara Bridge” surfaces which of these assets best support any recommended multiplication path.

**Master Brand Package (Drive):**  
https://drive.google.com/file/d/1yl93pQRLoFcOx7LzQQ8Fy3-f_wcr-J_W/view?usp=drivesdk  

**S'Cara Official Product & Brand Manual:**  
https://drive.google.com/file/d/1R0QM0bS_zJKD5sDNgyQhegxljtR3ltvl/view?usp=drivesdk  

---

## 7. Claims Boundary (Applies to All Engines)

**Allowed**  
Checklists, field guides, workbooks, architecture manuals, transparent credits, opportunity literacy (whoopertunity / floppertunity as educational labels).

**Forbidden**  
Medical cure language · guaranteed income, rankings, or ROI · spiritual verification as a product output · publish without confirm gates.

Doctrine remains immutable. Confirm gates are non-negotiable.

---

## 8. Completeness Snapshot (End of Day)

| Layer | Status |
|-------|--------|
| PIE core flow & scoring | LIVE (2.1-scorer) |
| PEIE definition & position | **LOCKED v1.0** |
| Competitor Ecosystem Mapping | **LOCKED v1.0** |
| Brand + S'Cara + Hamsa + Grok | **LOCKED** |
| System Architecture Manual | **LOCKED** |
| This Product Intelligence Architecture Manual | **LOCKED v1.0** |
| PEIE catalog graph & scoring formula | Spec |
| PEIE / CEM API surface | Spec |
| Worker 3.1 (Trend + PPI) | Pending deploy |

---

## 9. Recommended Next Build Sequence

1. Deploy worker 3.1 → health `3.1-trend-ppi`  
2. Operator nominates first 3–5 competitors → run first CEM mapping pass  
3. Design lightweight PEIE complementarity scoring formula  
4. Tag current catalog with relationship and lifecycle metadata  
5. Expose initial `/api/peie/...` and `/api/peie/cem/...` routes  
6. Surface ecosystem health + gap list in Command Center  

---

## 10. Document Index (This Family)

| Document | ID | Status |
|----------|----|--------|
| Product Intelligence Engine Architecture Manual (this document) | ARMR-DIG-PIE-ARCH-001 | LOCKED |
| Product Ecosystem Intelligence Engine | ARMR-ENG-PEIE-001 | LOCKED |
| Competitor Ecosystem Mapping | ARMR-ENG-PEIE-CEM-001 | LOCKED |
| System Architecture Manual | ARMR-DIG-SAGM-001 | LOCKED |
| S'Cara Official Product & Brand Manual | — | LOCKED |
| Grok Profile Lock | ARMR-BRAND-GROK-001 | LOCKED |
| MSOT | 2026-08-05.5 | LOCKED |
| Running File | r4 | Active |

---

## 11. Change Log

**v1.0 — 2026-08-05 (end of day)**  
- Consolidated full Product Intelligence family architecture  
- Integrated PIE + PEIE + Competitor Ecosystem Mapping  
- Anchored to locked S'Cara / Hamsa / Grok brand system  
- Scoring models, contracts, governance, and completeness recorded  
- Manual declared LOCKED  

---

*End of ARMR-DIG-PIE-ARCH-001 Product Intelligence Engine Architecture Manual v1.0*

**This is the complete Product Intelligence Engine Architecture Manual that was built across the day.**
