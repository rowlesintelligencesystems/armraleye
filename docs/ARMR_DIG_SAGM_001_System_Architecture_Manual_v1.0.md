# ARMR ALEYE — System Architecture Manual

**Document ID:** ARMR-DIG-SAGM-001  
**Title:** System Architecture Manual  
**Version:** 1.0  
**Status:** LOCKED  
**Effective:** 2026-08-05  
**Owner:** ARMR ALEYE LLC  
**Companion to:** MSOT 2026-08-05.5+ · Running File 2026-08-05  

---

## 1. Purpose & Scope

This manual is the definitive architectural reference for the ARMR ALEYE platform. It describes the live system topology, engine relationships, brand identity layer, product surface, and governance boundaries.

It is educational and operational. It does not make medical, income, or spiritual-verification claims.

---

## 2. Top-Level Architecture

```
ARMR ALEYE
├── Revenue Multiplication Engine (RME)          ← commercial umbrella
│   ├── Product Intelligence Engine (PIE)        ← core detect / match / push
│   ├── Profit Positioning Intelligence (PPI)    ← 10-factor opportunity scoring
│   ├── Trend Engine                             ← signal → score → placement
│   ├── Content Intelligence Engine (CIE)        ← blog / copy / manuals / names
│   ├── Architectural & Integration Intelligence (AIIE)
│   └── Packages · Manuals · Subscriptions
├── Access Layer
│   ├── Zero Trust gates
│   ├── RRMSD / NFC Access concept
│   └── Confirm gates (confirm_scan · confirm_push)
└── Governance
    ├── Doctrine (immutable sequence)
    ├── Claims boundary
    └── Brand lock (S'Cara · Hamsa · palette)
```

**Internal codenames never appear in customer-facing materials.**

---

## 3. Doctrine (Immutable)

1. Seek God within  
2. Unconditional love  
3. Understanding  
4. Harmonic balance  
5. Higher frequency / resonance  

The sequence is the architecture. Doctrine number one never changes. Cryptographic verification is exposed on `GET /api/doctrine`.

---

## 4. Brand Identity Layer (LOCKED 2026-08-05)

### 4.1 Name
**ARMR ALEYE** only.

### 4.2 Palette
| Role | Hex |
|------|-----|
| Deep Navy | `#0B1C2E` / `#0A0F1A` |
| Gold | `#C9A84C` |
| Ivory | `#F5F0E6` |
| Cyan Glow | `#00E5FF` |
| Light Blue | `#7EC8E3` |

### 4.3 Primary Mark
Winged golden “S” with luminous halo + lowercase wordmark **scara** / **S'Cara**.

### 4.4 Secondary Protective Emblem
**Hand of Hamsa + Eye of Horus** (glowing cyan / gold / hybrid / minimal variants).  
Used for packaging, secondary branding, and protective symbolism. Not sold as a standalone trademark product.

### 4.5 Wizard Persona
**S'Cara** — locked photorealistic avatar (white hair, ivory/gold ornate armor, golden halo, light-blue crystals).  
All product concept imagery uses the approved S'Cara renders. No dark-entity imagery.

### 4.6 Brand Asset Package
Complete package locked and uploaded:

- Official Brand Manual (PDF)  
- Executive Branding Package (PPTX)  
- Hamsa Emblem Update (PPTX)  
- Primary logo + 4 Hamsa variations + lockups  
- Character poses + S'Cara with Hamsa  
- Social assets (avatar, story, feed, covers)  
- Grok dual-branding assets  
- Hamsa animation source  

**Google Drive:** https://drive.google.com/file/d/1yl93pQRLoFcOx7LzQQ8Fy3-f_wcr-J_W/view?usp=drivesdk  

---

## 5. Live API Surface

| Host | https://api.armraleye.com |
|------|---------------------------|
| Commerce | https://www.armraleye.com |

### Core routes
- Health / Doctrine / Catalog / Entitlements / Systems / Completeness  
- PIE: detect · match · score · session  
- PPI: score · signal  
- Trend: blueprint (post 3.1)  
- CIE: blog · product-copy · manual · names · slogans · logo-brief · campaign  
- AIIE: architecture · integration  
- Push (requires `confirm_push:true`)

Match requires `confirm_scan:true`. Missing webhook secrets return `not_configured`.

---

## 6. Scoring Models (LOCKED)

### 6.1 PIE Match Scorer
```
S = 0.15A + 0.25J + 0.25C + 0.10P + 0.10B + 0.15T − p
```
Confidence bands: H ≥ 0.75 · M ≥ 0.45 · else L.

### 6.2 PPI 10-Factor (Drive Scoring Formula.docx)
Startup · Time · Monthly · Automation · Passive · Demand · Competition · Skill · Scalability · Trend  
Labels: whoopertunity · expansion · watch · pivot · floppertunity.

---

## 7. Product Surface

| Offer | Role |
|-------|------|
| PIE / PIE Heavy / Engine Stack | Subscription engines |
| DIG-DOC-001 Doctrine Architecture Manual | $67 |
| DIG-DOC-002 PIE Operator Manual | $67 |
| DIG-DOC-003 Milestone Payment Gate Handbook | $127 |
| ARMR-DIG-SAGM-001 System Architecture Manual (this document) | Flagship architecture |
| ARMR-DIG-WVF-001 Whoppertunity ebook | Educational |
| S'Cara (Product #1) | Execution companion persona & asset system |
| Hand of Hamsa Complete | Digital execution package |

---

## 8. Governance & Claims Boundary

**Allowed:** checklists, field guides, workbooks, architecture manuals, transparent credits, opportunity literacy.  
**Forbidden:** medical cure language; guaranteed income / rankings / ROI; spiritual verification as a product output; publish without confirm gates.

---

## 9. Completeness Snapshot (2026-08-05)

| Layer | Status |
|-------|--------|
| Edge API | 90–95 % (post 3.1 deploy) |
| Brand vector + S'Cara package | **LOCKED** |
| Shopify native draft | Pending Admin adapter |
| KV / D1 persistence | Spec |
| Members auth portal | Spec |

---

## 10. Change Log

**v1.0 — 2026-08-05**
- Initial System Architecture Manual locked  
- Integrated S'Cara avatar system + Protective Hamsa emblem  
- Brand package (Drive) referenced as source of truth  
- Aligned with MSOT 2026-08-05.5  

---

*End of ARMR-DIG-SAGM-001 System Architecture Manual v1.0*
