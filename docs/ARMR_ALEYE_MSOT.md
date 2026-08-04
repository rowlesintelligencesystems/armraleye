# ARMR ALEYE — Master Source of Truth (MSOT)

**Document Type:** Master Source of Truth + Running File  
**Version:** 2.0  
**Last Updated:** 2026-08-04  
**Location:** 01_Core_System  
**Status:** Active Living Document  
**Companion:** Master Checklist & Audit List (Entire Project)

---

## 1. Purpose

This is the single Master Source of Truth for ARMR ALEYE.  
It records foundational decisions, architecture, branding, and progress.  
All major work should reference and update this document.

---

## 2. Brand Core

| Element | Definition |
|---------|------------|
| **Name** | ARMR ALEYE |
| **Positioning** | Intelligent System Integration |
| **Tagline** | Protecting and connecting intelligent systems through ancient wisdom and modern technology |
| **Primary Symbol** | Hamsa (protective hand + central eye) |
| **Mission** | Secure, intelligent integration of systems, agents, data, and humans |
| **Primary Domain** | www.armraleye.com (DNS Cloudflare; domain via Shopify) |

---

## 3. Self-Funding Trinity

```
ARMR ALEYE - OS  →  AREA 44 (Inselligence)  →  JHETTI
```

| Layer | Identity | Role |
|-------|----------|------|
| **ARMR ALEYE - OS** | Operating System | Foundation & intelligent integration fabric |
| **AREA 44** | **Inselligence** | Funding / protected intelligence core |
| **JHETTI** | Aerospace Intelligence | Commercial application & revenue engine (AeroSeek, www.jhetti.com) |

Value flows from commercial activity (JHETTI and digital products) back into Area 44 to strengthen the OS.

---

## 4. Key Definitions

| Term | Definition |
|------|------------|
| ARMR ALEYE - OS | Core operating system and integration platform |
| Area 44 | Protected operational zone |
| Inselligence | Formal identity of Area 44 |
| JHETTI / AeroSeek | Aerospace Intelligence brand and product |
| Hamsa | Primary protective brand symbol |
| Doctrine Number One | Core doctrine monitored via NFC Ring (text TBD) |
| NFC Ring | Primary physical identity and access device |
| Zero Trust | Core security architecture: never trust, always verify |
| Command Center | Unified control-plane API and future UI |
| Native CRM | Built-in contacts, pipeline, subscriptions, automations |
| Client Portal | Lead-to-client workflow + document access (17hats-style) |

---

## 5. Zero Trust Architecture

Enforced through **Area 44 / Inselligence** and the **NFC Ring**.

| Principle | Implementation |
|-----------|----------------|
| Never trust, always verify | Identity required for non-public resources |
| Least privilege | Doctrine + policy at Area 44 |
| Assume breach | Isolated zone + continuous monitoring |
| Verify explicitly | NFC + device + context + doctrine |
| Micro-segmentation | Area 44 zone; products/coils as segments |
| Continuous validation | Ring / doctrine window checks |

**Code:** `src/lib/zero-trust.ts`, `src/lib/area44.ts`  
**APIs:** `/api/area44/status`, `/verify`, `/policy`, `/audit`

---

## 6. Physical Access & NFC Identity

- **NFC Ring:** Authenticates wearer; monitors Doctrine Number One; instantaneous login  
- **NFC coils:** Embedded in phones, controllers, home, vehicles, work systems  
- Physical embodiment of Area 44 / Inselligence  

Hardware and attestation protocol: outstanding.

---

## 7. Product Architecture

### Digital
- AI technical architecture packages  
- AI services  
- SaaS / subscriptions  
- Dashboard deployment  

### Physical
- NFC Ring  
- Products with NFC coils  

### Commerce
- Shopify for payments/catalog (domain already via Shopify)  
- Digital delivery and access via ARMR ALEYE / Area 44  

---

## 8. Backend Platforms (Built)

### 8.1 Agent Visibility (existing core)
- Cloudflare Workers + Hono + Workers AI + KV  
- Surfaces: llms.txt, index.json, slug.md, JSON-LD, robots, Content-Signal  

### 8.2 Command Center
- `GET /api/command-center` — Trinity status, Area 44, surfaces, controls, outstanding items  
- Visual UI: outstanding  

### 8.3 Native CRM
- Contacts, companies, deals, subscriptions, tasks, automation rules  
- APIs under `/api/crm/*`  
- Contacts support `ringId` and doctrine compliance fields  

### 8.4 Client Portal (17hats-inspired)
- Portal accounts, documents, workflow stages  
- Default journey: lead_captured → qualified → proposal_sent → proposal_accepted → portal_provisioned → onboarded → active  
- `POST /api/portal/accounts/:id/advance` runs stage actions  
- Email actions currently stubbed  

### 8.5 Audit
- Persist every policy decision to KV (bounded, 90-day TTL)  
- Optional AES-256-GCM encryption via `AUDIT_ENCRYPTION_KEY`  

### 8.6 Webhooks (budget Zapier path)
- `src/lib/webhook-dispatch.ts` — HTTPS POST to Catch Hook URLs  
- Portal workflow `webhook` action dispatches live  
- `POST /api/portal/webhook/send` for manual tests  
- Target: Zapier free Catch Hook → Notion (no paid Zapier app required)  

---

## 9. Organizational Drive Structure

```
ARMR ALEYE LLC
├── 01_Core_System          ← MSOT, architecture, checklists
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

## 10. Technical Stack Summary

| Layer | Stack |
|-------|--------|
| Runtime | Cloudflare Workers |
| Framework | Hono |
| AI | Workers AI (enrichment) |
| Storage | KV (VISIBILITY_CACHE) |
| Marketing | Static site/ + future Shopify storefront |
| Automation | Native workflows + Zapier Catch Hooks |
| Ops UI | Command Center API (UI TBD) |

**Repo:** `rowlesintelligencesystems/armraleye`  
**Private:** `armr-aleye-dynasty`

---

## 11. Running Log of Decisions & Progress

### 2026-08-04
- Homepage mockup applied; marketing pages in `site/`  
- Google Drive structure confirmed as org backbone  
- GitHub write access established  
- Company architecture drafted; JHETTI / AeroSeek identified  
- **Self-Funding Trinity** defined; Area 44 named **Inselligence**  
- MSOT created (v1.0)  
- Primary domain: **www.armraleye.com**  
- Digital products defined  
- Physical Access Layer: NFC Ring + Doctrine Number One + coils (MSOT v1.1)  
- **Zero Trust** adopted as core security doctrine (MSOT v1.2)  
- Zero Trust controls implemented in Worker  
- Audit persistence + AES-GCM encryption  
- Command Center API  
- Native CRM suite (contacts through automations)  
- Client Portal + automated lead-to-client workflows  
- Simple outbound webhook dispatcher for Zapier Catch Hooks  
- Master Checklist & Audit List (entire project) created  
- MSOT upgraded to **v2.0** (this document)

---

## 12. Outstanding Items (Summary)

**Critical**
- [ ] Set `ADMIN_TOKEN` and `AUDIT_ENCRYPTION_KEY` in production  
- [ ] Deploy and verify www.armraleye.com  
- [ ] Specify Doctrine Number One  
- [ ] CTO upload JHETTI assets  

**Near-term**
- [ ] Final Hamsa/background assets on site  
- [ ] Configure Zapier → Notion (3 high-value Zaps)  
- [ ] Shopify digital product catalog  
- [ ] Command Center visual UI  
- [ ] Real email for portal workflows  

**Later**
- [ ] NFC hardware + attestation  
- [ ] Client portal UI  
- [ ] Full Zapier REST Hook product (if scale requires)  

See **Master Checklist & Audit List** for phased detail.

---

## 13. Document Control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-08-04 | Initial MSOT |
| 1.1 | 2026-08-04 | Physical Access / NFC |
| 1.2 | 2026-08-04 | Zero Trust doctrine |
| 2.0 | 2026-08-04 | Full backend: CRM, Portal, Audit encryption, Command Center, Webhooks; running log current |

This document is authoritative. Update the running log when major decisions land.

---

*End of Master Source of Truth — Version 2.0*
