# ARMR Product Ecosystem Intelligence Engine (PEIE)

**Document ID:** ARMR-ENG-PEIE-001  
**Version:** 1.0  
**Status:** LOCKED  
**Effective:** 2026-08-05  
**Owner:** ARMR ALEYE LLC  
**Umbrella:** Revenue Multiplication Engine (RME)  
**Companion to:** MSOT 2026-08-05.5 · Architecture Manual · PIE / PPI  

---

## 1. Purpose

The **Product Ecosystem Intelligence Engine (PEIE)** is the system that understands, maps, scores, and optimizes the full ARMR ALEYE product landscape as a living ecosystem rather than a collection of isolated SKUs.

Where PIE focuses on individual product detection / match / push, and PPI scores opportunity for a single idea, **PEIE operates at the ecosystem layer**:

- Relationships between products  
- Complementary vs substitute dynamics  
- Bundle gravity and attachment rates  
- Lifecycle stage of each offer  
- Gap detection across the catalog  
- Multiplication paths (what should be built next to complete a customer journey)

---

## 2. Position in Architecture

```
Revenue Multiplication Engine (RME)
├── Product Intelligence Engine (PIE)          ← single-product detect / match / push
├── Profit Positioning Intelligence (PPI)      ← single-opportunity scoring
├── Trend Engine                               ← signal → score → placement
├── Content Intelligence Engine (CIE)
├── Architectural & Integration Intelligence (AIIE)
├── **Product Ecosystem Intelligence Engine (PEIE)**  ← NEW — catalog & relationship layer
└── Packages / Manuals / Subscriptions
```

PEIE sits above individual product engines and feeds them with ecosystem context.

---

## 3. Core Capabilities (v1)

| Capability | Description |
|------------|-------------|
| **Catalog Graph** | Live map of all active SKUs, their type (digital / sub / physical), price band, and status |
| **Relationship Scoring** | Complementary strength, substitute risk, bundle affinity |
| **Gap Detection** | Missing companion products that would complete a customer journey |
| **Lifecycle Stage** | Intro / Growth / Mature / Harvest / Sunset tags per offer |
| **Multiplication Paths** | Recommended next products or bundles that increase lifetime value without claims risk |
| **Ecosystem Health** | Simple score of coverage, density, and attachment potential |

---

## 4. Key Concepts

- **Anchor Product** — the primary purchase a customer starts with  
- **Companion Product** — high-complementarity digital that completes the job  
- **Bundle Gravity** — how strongly a set of products pulls additional purchases  
- **Claims-Safe Multiplication** — growth recommendations that stay inside the educational / operational boundary  
- **S'Cara Bridge** — PEIE surfaces which assets and manuals (including S'Cara and Hand of Hamsa) best support a given ecosystem path  

---

## 5. Relationship to Existing Engines

| Engine | PEIE Interaction |
|--------|------------------|
| PIE | Receives ecosystem context when matching or pushing a single product |
| PPI | Opportunity scores can be weighted by ecosystem fit |
| Trend | New trend signals are evaluated against current catalog gaps |
| CIE | Content generation can be steered by ecosystem needs |
| AIIE | Architecture recommendations include ecosystem coverage |

---

## 6. Data Inputs (v1)

- Current product catalog (Shopify + internal SKUs)  
- PIE match history and confidence bands  
- PPI opportunity scores  
- Manual relationship tags (complementary / substitute / bundle)  
- S'Cara and Hand of Hamsa asset usage  

Future: attachment data, refund signals, lifecycle telemetry.

---

## 7. Outputs (v1)

- Ecosystem map (text / graph summary)  
- Gap list with priority  
- Recommended multiplication paths  
- Bundle suggestions that respect claims boundary  
- Health snapshot for Command Center / MSOT  

---

## 8. Governance

- PEIE inherits the same claims boundary as all ARMR engines.  
- No income guarantees, ranking promises, or medical language.  
- All recommendations remain educational / operational.  
- Changes to locked product relationships require explicit owner authorization.

---

## 9. Status & Next

| Item | Status |
|------|--------|
| Definition & position | **LOCKED v1.0** |
| Catalog graph | Spec |
| Relationship scoring model | Spec |
| API surface (`/api/peie/...`) | Spec |
| Integration with PIE / PPI | Spec |

**Recommended next build steps**  
1. Define initial relationship tags for current catalog  
2. Design lightweight scoring formula for complementarity  
3. Add PEIE routes under the worker after 3.1 deploy  
4. Surface ecosystem health in Command Center  

---

## 10. Change Log

**v1.0 — 2026-08-05**  
- Product Ecosystem Intelligence Engine named and locked  
- Positioned inside RME above PIE / PPI  
- Core capabilities and governance recorded  

---

*End of ARMR-ENG-PEIE-001 Product Ecosystem Intelligence Engine v1.0*
