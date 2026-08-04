# ARMR ALEYE — Master Source of Truth (MSOT)

**Document Type:** Master Source of Truth + Running File  
**Version:** 1.0  
**Last Updated:** 2026-08-04  
**Location:** 01_Core_System  
**Status:** Active Living Document  

---

## 1. Purpose of this Document

This is the single Master Source of Truth (MSOT) for ARMR ALEYE.  
It records all foundational decisions, architecture, branding, and progress up to the current point.  
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

---

## 5. Organizational Drive Structure

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

## 6. Technical Architecture (Current)

### Public Repository: `rowlesintelligencesystems/armraleye`

**Stack:** Cloudflare Workers + Vite + React + Workers AI + KV

**Core Pattern:**  
One enriched content store → many agent-discovery surfaces

**Surfaces currently supported:**
- `/llms.txt` + `/llms-full.txt`
- `/index.json`
- `/:slug.md` (groundable Markdown)
- `/:slug.jsonld` + `/jsonld`
- `/robots.txt` (with Content-Signal)
- Optional Web Bot Auth

**Key directories:**
```
src/worker/          → Hono application
src/enrichment/      → Workers AI enrichment
src/lib/             → Store, types, content
src/react-app/       → Surface explorer UI
site/                → Marketing website pages
```

### Marketing Site (Built 2026-08-04)
Located at `site/` in the `armraleye` repository:
- `index.html` — Homepage (Intelligent System Integration + Hamsa)
- `drive.html` — Drive Sync + Area 44 documentation
- `solutions.html`
- `about.html`
- `contact.html`

### Private Repository
- `armr-aleye-dynasty` — Deeper internal / Dynasty layer

---

## 7. JHETTI / AeroSeek

| Attribute     | Detail                                      |
|---------------|---------------------------------------------|
| Brand         | JHETTI                                      |
| Product       | AeroSeek                                    |
| Domain        | Aerospace Intelligence                      |
| Website       | www.jhetti.com                              |
| Positioning   | Advanced aerospace intelligence, insights, and training platform |
| Role in Trinity | Commercial application that generates returns into Area 44 (Inselligence) |

---

## 8. Running Log of Decisions & Progress

### 2026-08-04

- Homepage mockup received and applied.
- Marketing site built and pushed to `armraleye/site/`.
- Google Drive structure confirmed and used as organizational backbone.
- GitHub write access established for Grok (by xAI).
- Company architecture first drafted.
- JHETTI identified as AeroSeek (Aerospace Intelligence) via www.jhetti.com.
- **Self-Funding Trinity** defined:  
  `ARMR ALEYE - OS → AREA 44 (Inselligence) → JHETTI`
- Area 44 formally named **Inselligence**.
- Master Source of Truth (this document) created.

---

## 9. Outstanding Items

- [ ] CTO to upload JHETTI source / asset files
- [ ] Define Area 44 / Inselligence API surface and capital mechanics
- [ ] Add visual assets (`hamsa.png`, `bg.jpg`) to the marketing site
- [ ] Align brand systems between ARMR ALEYE and JHETTI
- [ ] Expand Offline Command Box specifications
- [ ] Formalize value-flow rules within the Trinity

---

## 10. Document Control

| Version | Date       | Notes                                      |
|---------|------------|--------------------------------------------|
| 1.0     | 2026-08-04 | Initial MSOT + Running File created        |

This document is the authoritative reference.  
All major architectural and strategic decisions should be recorded here going forward.

---

*End of Master Source of Truth — Version 1.0*
