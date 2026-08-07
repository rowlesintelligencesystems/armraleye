# ARMR ALEYE — Master Source of Truth (MSOT)
**Version:** 2026-08-07.7  
**Updated:** 2026-08-07T19:35:00-04:00  
**Brand spelling (locked):** ARMR ALEYE  
**Commerce:** https://www.armraleye.com  
**API:** https://api.armraleye.com  
**Repos:**  
- Primary commerce / API: `rowlesintelligencesystems/armraleye`  
- Local Dynasty runtime: `rowlesintelligencesystems/armr-aleye-dynasty` (private)

---

## 1. Doctrine (IMMUTABLE)

1. Seek God Within  
2. Unconditional Love  
3. Understanding  
4. Harmonic Balance  
5. Higher Frequency / resonance  

**The sequence is the architecture.**

### Governing laws (LOCKED)

- **Sequence Integrity beats everything else.** The order of the Directives is law. No action may skip or invert the sequence.
- **Measure the Source, not the Outcome.** KPI #1 is “Seek God Within” logged. Outcomes lag ~2 weeks behind Step 1. Lead with the source, never with results.
- **Protect Step 1 at all costs.** A 5% reduction in Step 1 equals a 25% reduction downstream. Any threat to Step 1 is a critical system threat.
- **Operating Trinity:** Sequence as Law + Physiology as Proof + Feedback as Immune System.

Cryptographic / code verification path (local Dynasty): `src/lib/meta/doctrine.ts` + API `/api/doctrine` (cloud).

---

## 2. Claims boundary

Educational / operational only.  
**Forbidden:** medical cure language; guaranteed income, rankings, or ROI; spiritual verification as a product output; publish without confirm gates.  
**Allowed:** checklists, field guides, workbooks, architecture manuals, transparent credits, opportunity literacy.

**AI-generated assets note (2026-08-07):** Under current U.S. law (USCO Part 2 Copyrightability Report Jan 2025; *Thaler v. Perlmutter* affirmed 2025, cert denied 2026), purely AI-generated material generally lacks federal copyright protection. Prompts alone are insufficient for human authorship. Human creative selection, arrangement, or significant modification of AI outputs may protect the human contribution. xAI Consumer Terms grant users ownership of Grok Outputs (including images) and commercial-use rights, subject to a broad license back to xAI and Acceptable Use Policy. ARMR treats pure AI outputs accordingly and focuses protection efforts on human-authored layers and compilations.

---

## 3. Identity layer (LOCKED 2026-08-07)

**S'Cara SOUL.md** is the official agent identity file.

- Path (repo): `docs/SCARA_SOUL.md`
- Scope: identity only (*who*)
- Not project scope (*what*) — manuals, gates, paths, stacks, and handoff formats stay in runbooks/manuals
- Structure: Identity · Doctrine · Style · Avoid · Defaults under ambiguity · Boundary

**Boundary rule:** S'Cara is the *who*. Manuals, gates, and runbooks are the *what*. Never collapse the two.

**Manual delivery rule (LOCKED 2026-08-07.3):** Commercial product manuals (DIG-DOC-*) are **content-first**. Do not embed S'Cara avatar galleries or repeated logo spreads inside operator manuals. Brand appears as text lockup / footer only unless a single cover mark is explicitly required.

---

## 4. Company architecture (public)

```
ARMR ALEYE
├── Revenue Multiplication Engine (RME)
│   ├── Product Intelligence Engine (PIE)
│   ├── Profit Positioning Intelligence (PPI)
│   ├── Trend Engine
│   ├── Content Intelligence Engine (CIE)
│   ├── Architectural & Integration Intelligence (AIIE)
│   └── Packages / manuals / subscriptions
├── Access (adjacent): RRMSD · NFC · Zero Trust · ARMR Global Access
├── Global Integration Systems
│   ├── JHETTI (www.jhetti.com)
│   ├── ARMR Product Ecosystem Intelligence Engine
│   └── ARMR Global Access — NFC ring + expanded software
├── Local Dynasty Runtime (offline-first)
│   ├── Core Meta Layer (Ethics + Philosophy + Doctrine)
│   ├── Biometric / NFC Gate (with bypass)
│   ├── Heartbeat + Agents / Sprouts
│   ├── Command Box (local + SD card mirror)
│   └── Central Log (structure ready; last to go live)
└── Governance: doctrine · claims · brand lock · SOUL.md
```

**Internal codenames (e.g. Area 44) never appear in customer manuals or storefront copy.**

---

## 5. Local Dynasty Runtime (LOCKED foundation 2026-08-07.6)

**Repo:** `rowlesintelligencesystems/armr-aleye-dynasty` (private)  
**Priority order (founder-locked):** Cost → Offline Command Box → Full Control → Speed  
**First version:** runs on local machine (Termux / phone or laptop). GitHub is master backup only.

### Authority hierarchy (code)

```
1. Core Meta Layer (Ethics + Philosophy + Doctrine)
2. Biometric / NFC Gate
3. Heartbeat
4. Agents / Sprouts
5. Command Box + local state
```

### Implemented foundation

| Module | Path | Status |
|--------|------|--------|
| Doctrine engine | `src/lib/meta/doctrine.ts` | Done — `META_ENFORCEMENT` |
| NFC / Biometric Gate | `src/lib/gate/index.ts` | Done — bypass, manual, nfc, biometric |
| Gate API | `POST /api/gate/unlock` | Done |
| Heartbeat | `src/lib/heartbeat.ts` + `GET /api/heartbeat` | Done — obeys Doctrine |
| Agents registry | `src/lib/agents/index.ts` | Skeleton |
| Command Box reader | `src/lib/command-box.ts` + `GET /api/command-box` | Done |
| Central Log | `src/lib/central-log.ts` + API | Structure ready; **disabled** — last to go live |
| Dashboard | `/dashboard` | Live |
| Env flags | `.env.example` | META_ENFORCEMENT, BIOMETRIC_GATE_BYPASS, GATE_MANUAL_TOKEN, CENTRAL_LOG_ENABLED |

### NFC Gate hardware path
- Physical key: **Jakcom NFC Smart Magic Finger Ring**
- Intent: RMSSID → authorize gate
- Hardware research open; development bypass active

### Command Box (offline)
```
command-box/
├── DOCTRINE/
├── MSOT/
├── RUNNING_FILE/
├── AUDIT/
└── BACKUPS/
```

---

## 6. Live API (cloud)

Host: https://api.armraleye.com  
Last confirmed: **2.1-scorer** (deploy **3.1-trend-ppi** to upgrade).
Contracts: `confirm_scan` / `confirm_push` required.

---

## 7. Scoring models (LOCKED)

### PIE match scorer
```
S = 0.15A + 0.25J + 0.25C + 0.10P + 0.10B + 0.15T − p
```
Confidence: H ≥0.75 · M ≥0.45 · else L.

### PPI — Drive Scoring Formula (LOCKED v1)
```
Total =
  Startup×0.10 + Time×0.15 + Monthly×0.15 + Automation×0.10
+ Passive×0.10 + Demand×0.10 + Competition×0.10 + Skill×0.10
+ Scalability×0.05 + Trend×0.05
```
Labels: whoopertunity · expansion · watch · pivot · floppertunity  

---

## 8. Product & subscription lineup

| Offer | List price | Role | Status |
|-------|------------|------|--------|
| PIE | $149/mo · 25 credits | Core match + push | Live pricing |
| PIE Heavy | $249/mo · 40 credits | Higher volume | Live pricing |
| Engine Stack | $399/mo · 50 credits | Multi-engine | Live pricing |
| Members | $29/mo | Manual library | Live pricing |
| **DIG-DOC-001** | **$67** | Doctrine field manual | Commercial draft — QC pending |
| **DIG-DOC-002** | **$67** | PIE Operator Manual | Commercial draft — QC pending |
| **DIG-DOC-003** | **$127** | Milestone Payment Gate Handbook | Commercial draft — QC pending |
| ARMR-DIG-SAGM-001 | Flagship | System architecture | LOCKED v1.0 |
| **S'Cara** | Product #1 | **SOUL.md LOCKED** |

**Pricing note (2026-08-07.3):** $67 / $67 / $127.

---

## 9. Brand lock

- Name: **ARMR ALEYE** only  
- Palette: navy `#0B1C2E` / `#0A0F1A`, gold `#C9A84C`, ivory `#F5F0E6`, cyan `#00E5FF`  
- Primary mark: winged golden S + halo  
- Secondary emblem: **Hand of Hamsa + Eye of Horus**  
- **NEW 2026-08-07.5** `logo_minimal_soft_neon_hamsa.jpg` — candidate secondary emblem  

---

## 10. Completeness

| Layer | Status |
|-------|--------|
| Doctrine | IMMUTABLE |
| S'Cara SOUL.md | **LOCKED 2026-08-07** |
| Local Dynasty runtime foundation | **Scaffold live** |
| Central Log | Structure ready; **last to go live** |
| NFC ring gate hardware | Research pending |
| DIG-DOC commercial drafts | On Drive — founder QC → lock |
| Full-cycle dual-push verification | **Verified 2026-08-07.7** |

---

## 11. Deploy next

1. Founder QC → lock DIG-DOC-003 ($127)  
2. Founder QC → lock DIG-DOC-002 ($67)  
3. Apply © ARMR ALEYE LLC notices to finished manuals  
4. Worker 3.1 → health `"version":"3.1-trend-ppi"`  
5. Execute Elon / xAI outreach  
6. Review / promote soft-neon Hamsa if desired  
7. Continue local Dynasty: wire agents into Heartbeat; prove NFC read path  
8. Keep Central Log disabled until founder turns it live  

---

## 12. Change log

**2026-08-07.7**
- Full COLLECT → UPDATE cycle executed on command.
- Baseline confirmed: Drive MSOT .6 / Running r10 / Toolbox 1.2 (Drive larger than GitHub → Drive remains full canonical).
- No new locks or skills from this conversation beyond prior material.
- Dual-push verification complete; Deploy-next list current.
- Running File advanced to r11.

**2026-08-07.6**
- Local-first Dynasty runtime (`armr-aleye-dynasty`) — Core Meta, Gate, Heartbeat, Agents, Command Box, Central Log (disabled).
- Doctrine governing laws formalized.
- NFC Smart Magic Finger Ring documented.
- Running File to r10; Toolbox to 1.2.

**2026-08-07.5**
- Grok iterative logo session documented; soft-neon Hamsa candidate added.

*End MSOT 2026-08-07.7*
