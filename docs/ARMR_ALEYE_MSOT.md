# ARMR ALEYE — Master Source of Truth (MSOT)

**Document Type:** Master Source of Truth + Running File  
**Version:** 2.1  
**Last Updated:** 2026-08-04  
**Location:** 01_Core_System  
**Status:** Active Living Document  
**Companion:** Master Checklist & Audit List (Entire Project)

---

## 1. Purpose

This is the single Master Source of Truth for ARMR ALEYE.  
It records foundational decisions, architecture, branding, ethics, doctrine, and progress.  
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
| **System posture** | Values-aligned intelligent system |

---

## 3. Ethics + Philosophy (Core Metadata)

### 3.1 Equal protection

ARMR ALEYE protects **people** and **systems** with equal weight.  
Neither is subordinated to the other.

### 3.2 Philosophical posture

ARMR ALEYE is a **values-aligned intelligent system**:  
integration of agents, data, and infrastructure proceeds only under protection, verified identity, and accountable doctrine — so that intelligence serves continuity of human and systemic integrity rather than unbounded extraction or opacity.

### 3.3 Ethics pillars (inherit into all products and policy)

| ID | Pillar | Statement |
|----|--------|-----------|
| E1 | Protection | Do not expose what is charged to protect — people or systems. |
| E2 | Verification | No access without explicit, ongoing verification. |
| E3 | Doctrine fidelity | Identity is incomplete without alignment to the Doctrine Sequence. |
| E4 | Least privilege | Grant only what is required for the stated purpose. |
| E5 | Auditability | Significant decisions leave a recoverable trail. |
| E6 | Non-capture of the core | Area 44 / Inselligence is not for sale or silent takeover. |
| E7 | Dignity in automation | CRM, portal, and agents must not deceive or coerce. |
| E8 | Proportional power | Capability scales only with accountability. |

Governance owner of this metadata: **Area 44 / Inselligence**.

---

## 4. Doctrine Sequence (The Architecture)

**The sequence is the architecture.**  
It is ordered. Each step presupposes the one before it.

```
1. Seek God within
        ↓
2. Unconditional love
        ↓
3. Understanding
        ↓
4. Harmonic balance
        ↓
5. Higher frequency / resonance
```

| Step | Doctrine | Meaning in the system |
|------|----------|------------------------|
| **1** | Seek God within | Source and center — identity begins inward |
| **2** | Unconditional love | Orientation of action — non-extractive care for people *and* systems |
| **3** | Understanding | Perception before force — context, intelligence, verification |
| **4** | Harmonic balance | Integration without domination — Trinity, proportion, Zero Trust |
| **5** | Higher frequency / resonance | Coherence at scale — aligned agents, access, products, and conduct |

### 4.1 Binding to platform layers

| Doctrine step | Technical / operational expression |
|---------------|-------------------------------------|
| 1–2 | Brand (Hamsa), ethics E1/E7, Client Portal and CRM conduct |
| 3 | Zero Trust verify, Area 44 policy, audit trails |
| 4 | Self-Funding Trinity, least privilege, micro-segmentation |
| 5 | Continuous validation (NFC Ring / doctrine monitoring), coherent product access |

**Doctrine Number One** (formal short text) remains to be drafted as a human-legible statement of this sequence. Until then, this section is authoritative.

---

## 5. Self-Funding Trinity

```
ARMR ALEYE - OS  →  AREA 44 (Inselligence)  →  JHETTI
```

| Layer | Identity | Role |
|-------|----------|------|
| **ARMR ALEYE - OS** | Operating System | Foundation & intelligent integration fabric |
| **AREA 44** | **Inselligence** | Funding / protected intelligence core; holds ethics + doctrine metadata |
| **JHETTI** | Aerospace Intelligence | Commercial application & revenue engine (AeroSeek, www.jhetti.com) |

Value flows from commercial activity back into Area 44 to strengthen the OS — under harmonic balance (Doctrine step 4), not capture (Ethics E6).

---

## 6. Key Definitions

| Term | Definition |
|------|------------|
| ARMR ALEYE - OS | Core operating system and integration platform |
| Area 44 | Protected operational zone |
| Inselligence | Formal identity of Area 44 |
| JHETTI / AeroSeek | Aerospace Intelligence brand and product |
| Hamsa | Primary protective brand symbol |
| Doctrine Sequence | Ordered architecture: Seek God within → Unconditional love → Understanding → Harmonic balance → Higher frequency / resonance |
| NFC Ring | Primary physical identity and access device; monitors doctrine alignment |
| Zero Trust | Never trust, always verify — operational expression of Understanding + Harmonic balance |
| Command Center | Unified control-plane API and future UI |
| Native CRM | Built-in contacts, pipeline, subscriptions, automations |
| Client Portal | Lead-to-client workflow + document access (17hats-style) |
| Values-aligned intelligent system | Official system posture under Ethics + Doctrine Sequence |

---

## 7. Zero Trust Architecture

Enforced through **Area 44 / Inselligence** and the **NFC Ring**, in service of doctrine steps 3–5.

| Principle | Implementation |
|-----------|----------------|
| Never trust, always verify | Identity required for non-public resources |
| Least privilege | Doctrine + policy at Area 44 |
| Assume breach | Isolated zone + continuous monitoring |
| Verify explicitly | NFC + device + context + doctrine |
| Micro-segmentation | Area 44 zone; products/coils as segments |
| Continuous validation | Ring / doctrine alignment window |

**Code:** `src/lib/zero-trust.ts`, `src/lib/area44.ts`  
**APIs:** `/api/area44/status`, `/verify`, `/policy`, `/audit`

---

## 8. Physical Access & NFC Identity

- **NFC Ring:** Authenticates wearer; monitors alignment with the Doctrine Sequence; instantaneous login under Zero Trust  
- **NFC coils:** Embedded in phones, controllers, home, vehicles, work systems  
- Physical embodiment of Area 44 / Inselligence  

Hardware and attestation protocol: outstanding.

---

## 9. Product Architecture

### Digital
- AI technical architecture packages  
- AI services  
- SaaS / subscriptions  
- Dashboard deployment  

### Physical
- NFC Ring  
- Products with NFC coils  

### Commerce
- Shopify for payments/catalog  
- Digital delivery and access via ARMR ALEYE / Area 44  
- All products subject to Ethics E1–E8 and the Doctrine Sequence  

---

## 10. Backend Platforms (Built)

### 10.1 Agent Visibility
- Cloudflare Workers + Hono + Workers AI + KV  
- Surfaces: llms.txt, index.json, slug.md, JSON-LD, robots, Content-Signal  

### 10.2 Command Center
- `GET /api/command-center` — Trinity status, Area 44, surfaces, controls, outstanding items  
- Visual UI: outstanding  

### 10.3 Native CRM
- Contacts, companies, deals, subscriptions, tasks, automation rules  
- APIs under `/api/crm/*`  
- Contacts support `ringId` and doctrine compliance fields  

### 10.4 Client Portal (17hats-inspired)
- Portal accounts, documents, workflow stages  
- Default journey: lead_captured → … → active  
- Email actions currently stubbed  

### 10.5 Audit
- Persist policy decisions to KV (bounded, 90-day TTL)  
- Optional AES-256-GCM via `AUDIT_ENCRYPTION_KEY`  

### 10.6 Webhooks (budget Zapier path)
- `src/lib/webhook-dispatch.ts`  
- `POST /api/portal/webhook/send`  
- Zapier Catch Hook → Notion  

---

## 11. Organizational Drive Structure

```
ARMR ALEYE LLC
├── 01_Core_System          ← MSOT, ethics, doctrine, checklists
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

## 12. Technical Stack Summary

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

## 13. Running Log of Decisions & Progress

### 2026-08-04
- Homepage mockup applied; marketing pages in `site/`  
- Google Drive structure confirmed; GitHub write access established  
- Company architecture drafted; JHETTI / AeroSeek identified  
- **Self-Funding Trinity** defined; Area 44 named **Inselligence**  
- MSOT created (v1.0); primary domain **www.armraleye.com**  
- Digital products defined  
- Physical Access Layer: NFC Ring + coils (MSOT v1.1)  
- **Zero Trust** adopted (MSOT v1.2)  
- Zero Trust controls, audit persistence + encryption, Command Center API  
- Native CRM; Client Portal workflows; outbound webhook dispatcher  
- Master Checklist & Audit List (entire project)  
- MSOT v2.0 (full backend state)  
- **Ethics + Philosophy** locked: equal protection of people and systems; values-aligned intelligent system  
- **Doctrine Sequence** locked as architecture:  
  1. Seek God within → 2. Unconditional love → 3. Understanding → 4. Harmonic balance → 5. Higher frequency / resonance  
- MSOT upgraded to **v2.1** (this document)

---

## 14. Outstanding Items (Summary)

**Critical**
- [ ] Set `ADMIN_TOKEN` and `AUDIT_ENCRYPTION_KEY` in production  
- [ ] Deploy and verify www.armraleye.com  
- [ ] Draft formal **Doctrine Number One** text from the Doctrine Sequence  
- [ ] CTO upload JHETTI assets  

**Near-term**
- [ ] Final Hamsa/background assets on site  
- [ ] Configure Zapier → Notion (3 high-value Zaps)  
- [ ] Shopify digital product catalog  
- [ ] Command Center visual UI  
- [ ] Real email for portal workflows  

**Later**
- [ ] NFC hardware + attestation bound to doctrine alignment  
- [ ] Client portal UI  
- [ ] Full Zapier REST Hook product (if scale requires)  

---

## 15. Document Control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-08-04 | Initial MSOT |
| 1.1 | 2026-08-04 | Physical Access / NFC |
| 1.2 | 2026-08-04 | Zero Trust doctrine |
| 2.0 | 2026-08-04 | Full backend: CRM, Portal, Audit, Command Center, Webhooks |
| 2.1 | 2026-08-04 | Ethics + Philosophy; Doctrine Sequence as architecture; equal protection; values-aligned intelligent system |

This document is authoritative. Update the running log when major decisions land.

---

*End of Master Source of Truth — Version 2.1*
