# ARMR ALEYE — Master Source of Truth (MSOT)

**Document Type:** Master Source of Truth + Running File  
**Version:** 1.1  
**Last Updated:** 2026-08-04  
**Location:** 01_Core_System  
**Status:** Active Living Document  

---

## 1. Purpose of this Document

This is the single Master Source of Truth (MSOT) for ARMR ALEYE.  
It records all foundational decisions, architecture, branding, and progress.  
All future work should reference and update this document.

---

## 2. Brand Core

| Element              | Definition                                                                 |
|----------------------|----------------------------------------------------------------------------|
| **Name**             | ARMR ALEYE                                                                 |
| **Positioning**      | Intelligent System Integration                                             |
| **Tagline**          | Protecting and connecting intelligent systems through ancient wisdom and modern technology |
| **Primary Symbol**   | Hamsa (protective hand + central eye) — defense + awareness                |
| **Mission**          | Secure, intelligent integration of systems, agents, data, and humans       |

---

## 3. The Self-Funding Trinity (Primary Strategic Model)

```
ARMR ALEYE - OS  →  AREA 44 (Inselligence)  →  JHETTI
```

| Layer                      | Identity                  | Role                                          |
|----------------------------|---------------------------|-----------------------------------------------|
| **ARMR ALEYE - OS**            | Operating System          | Foundation & Intelligent Integration Fabric   |
| **AREA 44**                    | **Inselligence**          | Funding / Protected Intelligence Core         |
| **JHETTI**                     | Aerospace Intelligence    | Commercial Application & Revenue Engine       |

### Value Flow
- The OS provides the platform and agent infrastructure.
- Area 44 (Inselligence) is the protected funding and intelligence core.
- JHETTI generates commercial returns that flow back into Area 44 to strengthen the OS.
- This forms a closed, self-funding loop.

---

## 4. Key Definitions

| Term                | Definition                                                                 |
|---------------------|----------------------------------------------------------------------------|
| **ARMR ALEYE - OS**     | The core operating system and intelligent integration platform             |
| **Area 44**             | The protected operational zone of the company                              |
| **Inselligence**        | The formal identity of Area 44 — protected funding + intelligence core     |
| **JHETTI**              | Brand and product line for Aerospace Intelligence                          |
| **AeroSeek**            | The product platform under JHETTI (www.jhetti.com)                         |
| **Hamsa**               | Primary protective symbol of the brand                                     |
| **Doctrine Number One** | Core doctrine monitored via the NFC Ring identity system                   |
| **NFC Ring**            | Primary physical identity and access device                                |

---

## 5. Physical Access & NFC Identity Layer

### Primary Device: NFC Ring
- Authenticates the wearer to the ARMR ALEYE system
- Monitors **Doctrine Number One**
- Enables instantaneous login and access
- Serves as a portable identity token for Area 44 / Inselligence

### Ecosystem Integration
NFC coils will be embedded into products so the ring can grant verified personal access to:

| Category              | Examples                                      |
|-----------------------|-----------------------------------------------|
| Personal Devices      | Phone, game controller                        |
| Home                  | Door locks, home access systems               |
| Mobility              | Vehicle access                                |
| Work / Enterprise     | Workspace entry, system login                 |
| Broader Ecosystem     | Any product requiring verified personal access|

### Architectural Position

```
ARMR ALEYE - OS
       ↓
AREA 44 (Inselligence)     ← Identity, Doctrine monitoring, Access control
       ↓
Access Layer
  • NFC Ring (primary)
  • Embedded NFC Coils
       ↓
Digital + Physical Product Suite
```

The NFC Ring is the physical embodiment of Area 44 / Inselligence — a verifiable identity and doctrine compliance layer.

---

## 6. Product Architecture

### Digital Products
- AI Technical Architecture offerings
- AI Services
- SaaS products
- Subscriptions
- Dashboard deployment capabilities

### Physical Products
- NFC Ring (identity + Doctrine Number One monitoring + access)
- Products containing NFC coils for ring-based access

### Commerce Approach
- Shopify currently handles domain and is positioned for payments/subscriptions
- Digital delivery and dashboard access provisioned through ARMR ALEYE / Area 44
- Physical NFC products fulfill through appropriate channels

---

## 7. Organizational Drive Structure

```
ARMR ALEYE LLC
├── 01_Core_System                 ← Doctrine, Architecture, MSOT
├── 02_Brand_Assets
├── 03_Products_and_Automation
├── 04_Legal_and_Licenses
├── 05_Code_and_Pipelines
├── 06_Offline_Command_Box
├── 07_Staging
├── 08_Command_Suite
├── 09_Workforce_and_Agents
├── 10_Audit_and_Checklist
└── Website_Assets_and_Area44
```

---

## 8. Technical Architecture (Current)

### Public Repository: `rowlesintelligencesystems/armraleye`
**Stack:** Cloudflare Workers + Vite + React + Workers AI + KV  
**Domain:** www.armraleye.com (DNS on Cloudflare, domain via Shopify)

**Core Pattern:** One enriched content store → many agent-discovery surfaces

**Marketing Site:** Built and located at `site/`  
**Agent Surfaces:** `/llms.txt`, `/index.json`, `/*.md`, JSON-LD, robots.txt, Content-Signal

### Private Repository
- `armr-aleye-dynasty` — Deeper internal / Dynasty layer

---

## 9. JHETTI / AeroSeek

| Attribute       | Detail                                                      |
|-----------------|-------------------------------------------------------------|
| Brand           | JHETTI                                                      |
| Product         | AeroSeek                                                    |
| Domain          | Aerospace Intelligence                                      |
| Website         | www.jhetti.com                                              |
| Role in Trinity | Commercial application generating returns into Area 44      |

---

## 10. Running Log of Decisions & Progress

### 2026-08-04
- Homepage mockup received and applied.
- Marketing site built and pushed to `armraleye/site/`.
- Google Drive structure confirmed as organizational backbone.
- GitHub write access established.
- Company architecture drafted.
- JHETTI identified as AeroSeek (Aerospace Intelligence).
- **Self-Funding Trinity** defined:  
  `ARMR ALEYE - OS → AREA 44 (Inselligence) → JHETTI`
- Area 44 formally named **Inselligence**.
- Master Source of Truth created (v1.0).
- Primary domain confirmed: **www.armraleye.com**.
- Digital product suite defined (AI architecture, SaaS, subscriptions, dashboards).
- **Physical Access Layer** introduced: NFC Ring + Doctrine Number One + ecosystem NFC coils.
- MSOT updated to v1.1 with Physical Access & NFC Identity Layer.

---

## 11. Outstanding Items

- [ ] CTO to upload JHETTI source / asset files
- [ ] Define Area 44 / Inselligence API surface and capital mechanics
- [ ] Specify Doctrine Number One
- [ ] NFC Ring hardware + backend authentication design
- [ ] Add visual assets (`hamsa.png`, `bg.jpg`) to marketing site
- [ ] Deploy marketing site to www.armraleye.com
- [ ] Align brand systems between ARMR ALEYE and JHETTI
- [ ] Formalize value-flow rules within the Trinity
- [ ] Define NFC coil integration standards for third-party products

---

## 12. Document Control

| Version | Date       | Notes                                                        |
|---------|------------|--------------------------------------------------------------|
| 1.0     | 2026-08-04 | Initial MSOT + Running File created                          |
| 1.1     | 2026-08-04 | Added Physical Access & NFC Identity Layer + Digital products|

This document is the authoritative reference.  
All major architectural and strategic decisions should be recorded here going forward.

---

*End of Master Source of Truth — Version 1.1*
