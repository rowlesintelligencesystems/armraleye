# ARMR ALEYE — Master Source of Truth (MSOT)

**Document Type:** Master Source of Truth + Running File  
**Version:** 2.2  
**Last Updated:** 2026-08-04  
**Location:** 01_Core_System  
**Status:** Active Living Document  
**Companion:** Master Checklist & Audit List · ARMR-POL-EPD-001

---

## 1. Purpose

This is the single Master Source of Truth for ARMR ALEYE.  
It records foundational decisions, architecture, branding, ethics, doctrine, and progress.  
All major work should reference and update this document.

**Authoritative ethics, philosophy, and doctrine policy:**  
**ARMR-POL-EPD-001** — *Ethics, Philosophy, and Doctrine Policy* (v1.0, effective 2026-08-04).  
Where this MSOT summarizes those topics, **ARMR-POL-EPD-001 controls**.

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

## 3. Ethics + Philosophy + Doctrine

### 3.1 Governing policy

| Field | Value |
|-------|--------|
| **Document ID** | ARMR-POL-EPD-001 |
| **Title** | Ethics, Philosophy, and Doctrine Policy |
| **Version** | 1.0 |
| **Effective** | 2026-08-04 |
| **Owner** | Area 44 / Inselligence |
| **Drive** | 01_Core_System |
| **Repo** | `docs/ARMR-POL-EPD-001_Ethics_Philosophy_Doctrine_Policy.md` |

### 3.2 Summary (non-authoritative; see policy for full text)

**Philosophy:** Values-aligned intelligent system; equal protection of people and systems; Hamsa as symbol of protection + awareness.

**Ethics pillars:** E1 Protection · E2 Verification · E3 Doctrine fidelity · E4 Least privilege · E5 Auditability · E6 Non-capture of the core · E7 Dignity in automation · E8 Proportional power.

**Doctrine Sequence (the architecture):**

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

**Doctrine Number One** (adopted in ARMR-POL-EPD-001):

> Seek God within.  
> From that center, act with unconditional love.  
> Meet every system and person with understanding.  
> Hold harmonic balance in all integration of power.  
> Rise toward higher frequency and resonance.  
>  
> This sequence is the architecture.  
> Identity, access, and authority in ARMR ALEYE are measured by fidelity to it.  
> People and systems are protected equally under this doctrine.

---

## 4. Self-Funding Trinity

```
ARMR ALEYE - OS  →  AREA 44 (Inselligence)  →  JHETTI
```

| Layer | Identity | Role |
|-------|----------|------|
| **ARMR ALEYE - OS** | Operating System | Foundation & intelligent integration fabric |
| **AREA 44** | **Inselligence** | Funding / protected intelligence core; owner of ARMR-POL-EPD-001 |
| **JHETTI** | Aerospace Intelligence | Commercial application & revenue engine (AeroSeek, www.jhetti.com) |

Value flow is subject to Doctrine step 4 (Harmonic balance) and Ethics E6 (Non-capture of the core).

---

## 5. Key Definitions

| Term | Definition |
|------|------------|
| ARMR ALEYE - OS | Core operating system and integration platform |
| Area 44 | Protected operational zone |
| Inselligence | Formal identity of Area 44 |
| JHETTI / AeroSeek | Aerospace Intelligence brand and product |
| Hamsa | Primary protective brand symbol |
| ARMR-POL-EPD-001 | Formal Ethics, Philosophy, and Doctrine Policy |
| Doctrine Sequence | Ordered architecture per ARMR-POL-EPD-001 §5 |
| Doctrine Number One | Formal doctrinal statement in ARMR-POL-EPD-001 §5.2 |
| NFC Ring | Primary physical identity device; may monitor doctrine alignment |
| Zero Trust | Never trust, always verify — operational expression of Understanding + Harmonic balance |
| Command Center | Unified control-plane API and future UI |
| Native CRM | Built-in contacts, pipeline, subscriptions, automations |
| Client Portal | Lead-to-client workflow + document access |
| Values-aligned intelligent system | Official system posture under ARMR-POL-EPD-001 |

---

## 6. Zero Trust Architecture

Enforced through **Area 44 / Inselligence** and the **NFC Ring**, in service of doctrine steps 3–5 and ARMR-POL-EPD-001.

| Principle | Implementation |
|-----------|----------------|
| Never trust, always verify | Identity required for non-public resources |
| Least privilege | Doctrine + policy at Area 44 (Ethics E4) |
| Assume breach | Isolated zone + continuous monitoring |
| Verify explicitly | NFC + device + context + doctrine |
| Micro-segmentation | Area 44 zone; products/coils as segments |
| Continuous validation | Ring / doctrine alignment window |

**Code:** `src/lib/zero-trust.ts`, `src/lib/area44.ts`  
**APIs:** `/api/area44/status`, `/verify`, `/policy`, `/audit`

---

## 7. Physical Access & NFC Identity

- **NFC Ring:** Authenticates wearer; may monitor alignment with the Doctrine Sequence; instantaneous login under Zero Trust  
- **NFC coils:** Embedded in phones, controllers, home, vehicles, work systems  
- Subject to ARMR-POL-EPD-001 binding effect (§5.3)

Hardware and attestation protocol: outstanding.

---

## 8. Product Architecture

### Digital
- AI technical architecture packages · AI services · SaaS / subscriptions · Dashboard deployment  

### Physical
- NFC Ring · Products with NFC coils  

### Commerce
- Shopify for payments/catalog  
- All products subject to ARMR-POL-EPD-001  

---

## 9. Backend Platforms (Built)

| Platform | Notes |
|----------|--------|
| Agent Visibility | Workers + Hono + KV; llms.txt, index.json, md, JSON-LD |
| Command Center | `GET /api/command-center` |
| Native CRM | `/api/crm/*` — contacts, deals, subscriptions, automations |
| Client Portal | `/api/portal/*` — workflows, advance, documents |
| Audit | KV persistence + optional AES-256-GCM |
| Webhooks | Zapier Catch Hook path; `POST /api/portal/webhook/send` |

---

## 10. Organizational Drive Structure

```
ARMR ALEYE LLC
├── 01_Core_System          ← MSOT, ARMR-POL-EPD-001, checklists
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

## 11. Technical Stack Summary

| Layer | Stack |
|-------|--------|
| Runtime | Cloudflare Workers |
| Framework | Hono |
| AI | Workers AI (enrichment) |
| Storage | KV (VISIBILITY_CACHE) |
| Marketing | Static site/ + future Shopify storefront |
| Automation | Native workflows + Zapier Catch Hooks |
| Governance | ARMR-POL-EPD-001 + Area 44 |

**Repo:** `rowlesintelligencesystems/armraleye`  
**Private:** `armr-aleye-dynasty`

---

## 12. Running Log of Decisions & Progress

### 2026-08-04
- Homepage mockup applied; marketing pages in `site/`  
- Google Drive structure confirmed; GitHub write access established  
- Company architecture drafted; JHETTI / AeroSeek identified  
- **Self-Funding Trinity** defined; Area 44 named **Inselligence**  
- MSOT created (v1.0); primary domain **www.armraleye.com**  
- Digital products; Physical Access / NFC (v1.1); **Zero Trust** (v1.2)  
- Zero Trust controls, audit encryption, Command Center API  
- Native CRM; Client Portal; outbound webhook dispatcher  
- Master Checklist & Audit List (entire project)  
- MSOT v2.0 (full backend state)  
- Ethics + Philosophy + Doctrine Sequence locked (v2.1)  
- **Formal policy ARMR-POL-EPD-001 v1.0 issued** — Ethics, Philosophy, and Doctrine; Doctrine Number One adopted  
- MSOT upgraded to **v2.2** — policy designated authoritative for ethics/philosophy/doctrine  

---

## 13. Outstanding Items (Summary)

**Critical**
- [ ] Set `ADMIN_TOKEN` and `AUDIT_ENCRYPTION_KEY` in production  
- [ ] Deploy and verify www.armraleye.com  
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

---

## 14. Document Control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-08-04 | Initial MSOT |
| 1.1 | 2026-08-04 | Physical Access / NFC |
| 1.2 | 2026-08-04 | Zero Trust |
| 2.0 | 2026-08-04 | Full backend platforms |
| 2.1 | 2026-08-04 | Ethics + Doctrine Sequence in MSOT |
| 2.2 | 2026-08-04 | ARMR-POL-EPD-001 designated authoritative; Doctrine Number One adopted by formal policy |

**Related:**  
- ARMR-POL-EPD-001 — Ethics, Philosophy, and Doctrine Policy  
- Master Checklist & Audit List  

This document is authoritative for architecture and progress.  
**ARMR-POL-EPD-001 is authoritative for ethics, philosophy, and doctrine.**

---

*End of Master Source of Truth — Version 2.2*
