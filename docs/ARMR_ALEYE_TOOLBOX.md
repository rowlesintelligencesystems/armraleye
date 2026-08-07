# ARMR ALEYE — Toolbox
**Version:** 1.2  
**Updated:** 2026-08-07  
**MSOT reference:** 2026-08-07.6  
**Purpose:** Running inventory of skills, tools, templates, how-tos, quality bars, and scoring systems used to ship ARMR ALEYE work.  
**Owner rule:** Update this file when a skill is proven in production. Do not invent tools that were never used.

---

## 1. What this document is

| This is | This is not |
|---------|-------------|
| Skills and methods that actually shipped | A wish list of future AI features |
| Templates you can copy | Customer-facing product manuals |
| Quality examples (good vs poor) | Doctrine or SOUL.md (identity lives elsewhere) |
| Scoring / scaling systems in use | Internal codenames for public copy |

**Related docs**
- MSOT — source of truth (prices, locks, architecture)
- Running File — session log
- SCARA_SOUL.md — identity only (*who*)
- DIG-DOC-* — customer product manuals (*what*)
- Local Dynasty runtime — `armr-aleye-dynasty` repo

---

## 2. Skills inventory

### 2.1 Content & product manuals

| Skill | Description | When to use |
|-------|-------------|-------------|
| Content-first manual build | Dense operator text + tables; footer brand only; no avatar galleries | DIG-DOC $67–$127 products |
| Claims boundary pass | Strip medical / guaranteed income / ranking language before publish | Every customer-facing title and body |
| Confirm-gate documentation | Always document `confirm_scan` / `confirm_push` as non-negotiable | PIE / API operator materials |
| Commercial cover lock | List price on cover matches MSOT ($67 / $67 / $127) | Never label commercial manuals as “$5” |
| Guideline TOC fidelity | Follow founder-supplied TOC before expanding depth | When a guideline PDF/Drive file exists |

### 2.2 Brand & logo production

| Skill | Description | When to use |
|-------|-------------|-------------|
| Navy-plate composite | Place mark on solid `#0A0F1A` for perfect edge blend | Dark UI, manuals, Shopify on navy |
| Raster master preference | Prefer approved JPG masters as-is on dark surfaces | Fast ship; avoid alpha rabbit holes |
| SVG production pack use | Hand-authored icon / horizontal / vertical SVGs | Editable strokes, web, print vectors |
| Isolate → vectorize → plate | Threshold cyan → VTracer spline → composite on navy | Remove JPEG bottom pixelation only when needed |
| Simplified SVG | Tiny `viewBox 0 0 200 240` minimal mark | Favicon / small chrome |
| **Grok iterative logo refinement** | Successive Grok Imagine edits: pixel art → HD → 4K → declutter → smooth glow → Eye/node refine → “less is more” minimalist | When a logo needs progressive aesthetic tightening (proven 2026-08-07 on circuit Hamsa) |

### 2.3 Engineering & API

| Skill | Description | When to use |
|-------|-------------|-------------|
| Health-first verify | `GET /api/health` before assuming feature set | Any API work |
| Confirm-gated POST | Never document auto-publish; require confirm flags | Match / push flows |
| Secrets → not_configured | Missing webhooks return explicit not_configured | Worker secrets / Zapier hooks |
| MSOT-aligned scoring | Use locked PIE and PPI formulas only | Match score / opportunity labels |
| **Doctrine-gated action** | Every privileged local action passes `checkDoctrine()` | Heartbeat, gate unlock, agent assign |
| **Gate unlock API** | `POST /api/gate/unlock` with method bypass\|manual\|nfc\|biometric | Access control for dashboard / privileged ops |
| **Local-first Next on Termux** | `npx next dev --webpack` (Turbopack unsupported on Android arm64) | Phone-side Dynasty runtime |

### 2.4 Ops & delivery

| Skill | Description | When to use |
|-------|-------------|-------------|
| Drive + Repo dual push | Upload artifacts to Google Drive and `docs/` on GitHub | Every locked document |
| Thread scrape → MSOT | Incorporate decisions into MSOT + Running File | End of material sessions |
| Founder QC gate | Commercial drafts stay “pending lock” until QC | DIG-DOC completion |
| Brief fidelity | Do exactly what was asked; no side quests | Default under ambiguity |
| **Command Box mirror** | Keep `command-box/` folders in sync with physical SD inventory | Offline readiness |
| **Feature-flag last-to-live** | Ship structure early; enable Central Log only when founder flips flag | Components that must not go live early |

---

## 3. Tools needed for the job

### 3.1 Always available

| Tool | Job |
|------|-----|
| ReportLab (Python) | Commercial PDF manuals |
| Pillow / NumPy | Raster crop, mask, navy plate |
| VTracer | Raster → SVG isolate |
| Google Drive (connected) | Search, upload, download artifacts |
| GitHub (connected) | Push `docs/` to repos |
| Cloudflare Worker host | `api.armraleye.com` |
| Shopify storefront | `www.armraleye.com` commerce |
| Grok Imagine | Iterative logo / avatar refinement |
| Termux + Node | Local Dynasty `next dev --webpack` |

### 3.2 Optional / external

| Tool | Job |
|------|-----|
| Jakcom NFC Smart Magic Finger Ring | Intended physical gate key (RMSSID) |
| YubiKey | Hardware key in physical Command Box |
| Zapier Catch Hook | Social / automation webhook target |

### 3.3 Do not rely on for ship

| Anti-tool pattern | Why |
|-------------------|-----|
| Endless alpha extraction | Burns time; navy plate solves blend |
| Avatar image generation inside manuals | Violates content-first rule |
| Guessing API contracts | Check `/api/health` and MSOT |
| Enabling Central Log early | Explicitly last to go live |

---

## 4. Templates

### 4.1 Gate unlock call (local Dynasty)

```json
{
  "method": "bypass|manual|nfc|biometric",
  "token": "armr-dev-bypass",
  "id": "ring-uid-or-rmssid",
  "status": "verified"
}
```

### 4.2 Local Dynasty env flags

```env
META_ENFORCEMENT=false
BIOMETRIC_GATE_BYPASS=true
GATE_MANUAL_TOKEN=armr-dev-bypass
CENTRAL_LOG_ENABLED=false
```

### 4.3 Claims rewrite checklist

- [ ] No cure / heal / treat
- [ ] No guaranteed AOV, income, or ROI
- [ ] No “#1 rank” / guaranteed traffic
- [ ] No “we publish without your approval”

### 4.4 MSOT change-log entry

```
**YYYY-MM-DD.N**
- Bullet of decision or lock
- Bullet of artifact shipped
- Running File advanced to rN
```

---

## 5. How-to manuals (operator)

### 5.1 Run local Dynasty on Termux

1. Clone `armr-aleye-dynasty` (use PAT; password auth rejected).  
2. `pkg install nodejs` if needed.  
3. `npm install`.  
4. `cp .env.example .env.local`.  
5. Start with Webpack: `npx next dev --webpack` (Turbopack fails on Android arm64).  
6. Open `http://localhost:3000` and `/dashboard`.  
7. Confirm Heartbeat ALIVE and Command Box section.

### 5.2 Doctrine check before privileged action

```ts
checkDoctrine({
  action: "…",
  preservesSequence: true,
  protectsStep1: true,
  logsSeekGodWithin: true
})
```

If `META_ENFORCEMENT=true` and checks fail → block and log.

### 5.3 Update MSOT + Running File

1. Scan Drive for newer MSOT/Running File.  
2. Scrape session decisions.  
3. Bump MSOT version + Running File revision.  
4. Push Drive **and** GitHub `docs/`.  
5. Point “Deploy next” at the real next ship item.

### 5.4 Grok iterative logo refinement (proven)

1. Start from user feedback on current mark.  
2. Generate clean intentional base.  
3. Iterate: resolution → detail → declutter → glow → Eye refine → node balance → “less is more”.  
4. Stop when user signals approval.  
5. Save final raster, document in MSOT, dual-push.

---

## 6. Scaling & scoring systems

### 6.1 PIE match scorer (LOCKED)

```
S = 0.15A + 0.25J + 0.25C + 0.10P + 0.10B + 0.15T − p
```

**Confidence:** H ≥ 0.75 · M ≥ 0.45 · else L  
**Rule:** L confidence = stop-and-edit, not push.

### 6.2 PPI opportunity scale (LOCKED v1)

```
Total =
  Startup×0.10 + Time×0.15 + Monthly×0.15 + Automation×0.10
+ Passive×0.10 + Demand×0.10 + Competition×0.10 + Skill×0.10
+ Scalability×0.05 + Trend×0.05
```

**Labels:** whoopertunity · expansion · watch · pivot · floppertunity  

### 6.3 Manual commercial scale (list)

| SKU | List |
|-----|------|
| DIG-DOC-001 | $67 |
| DIG-DOC-002 | $67 |
| DIG-DOC-003 | $127 |
| Subscriptions | $29–$399/mo |

---

## 7. Quality examples

### Excellent
- Content-first manuals; real list price; claims-safe; dual-pushed  
- Doctrine check before privileged ops  
- Gate bypass only while `BIOMETRIC_GATE_BYPASS=true`  
- Central Log remains off until founder enables  

### Poor
- Labeled $5 when list is $67–$127  
- Avatar/logo spam in manuals  
- Guaranteed income or medical language  
- Turning Central Log on without founder OK  

---

## 8. Doctrine interaction (reminder)

1. Seek God Within — pause before push; log the source  
2. Unconditional love — no dark patterns on confirms  
3. Understanding — detect platform/context first  
4. Harmonic balance — free utility vs paid depth; human approve  
5. Higher frequency — fewer coherent offers over channel spam  

Sequence Integrity is law. Protect Step 1 at all costs.

---

## 9. Version log

**1.2 — 2026-08-07**
- Added local Dynasty skills: Doctrine-gated action, Gate unlock API, Termux Next webpack run, Command Box mirror, feature-flag last-to-live  
- Added templates: Gate unlock JSON, local env flags  
- Added how-tos: Run local Dynasty on Termux; Doctrine check  
- Aligned to MSOT 2026-08-07.6  

**1.1 — 2026-08-07**
- Added Grok iterative logo refinement skill  
- Aligned to MSOT 2026-08-07.5  

**1.0 — 2026-08-07**
- Initial Toolbox  

*End Toolbox v1.2*
