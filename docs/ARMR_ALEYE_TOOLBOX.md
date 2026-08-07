# ARMR ALEYE — Toolbox
**Version:** 1.2  
**Updated:** 2026-08-07  
**MSOT reference:** 2026-08-07.7  
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
| **Command Box mirror** | Keep `command-box/` folders (DOCTRINE, MSOT, RUNNING_FILE, AUDIT, BACKUPS) in sync with physical SD inventory | Offline readiness |
| **Feature-flag last-to-live** | Ship structure early; enable Central Log only when founder flips flag | Components that must not go live early |

---

## 3. Tools needed for the job

### 3.1 Always available (this environment)

| Tool | Job |
|------|-----|
| ReportLab (Python) | Commercial PDF manuals |
| Pillow / NumPy | Raster crop, mask, navy plate |
| VTracer | Raster → SVG isolate (spline/binary) |
| CairoSVG | SVG → PNG proof |
| Google Drive (connected) | Search, upload, download artifacts |
| GitHub (connected) | Push `docs/` to `rowlesintelligencesystems/armraleye` and runtime repo |
| Cloudflare Worker host | `api.armraleye.com` |
| Shopify storefront | `www.armraleye.com` commerce |
| Grok Imagine (edit / generate) | Iterative logo / avatar refinement |
| Termux + Node (founder device) | Local Dynasty `next dev --webpack` |

### 3.2 Optional / external

| Tool | Job |
|------|-----|
| Zapier Catch Hook | Social / automation webhook target |
| Jakcom NFC Smart Magic Finger Ring | Intended physical gate key (RMSSID) |
| YubiKey | Hardware key in physical Command Box |
| Adobe / vector editor | Human refinement of production SVG if needed |

### 3.3 Do not rely on for ship

| Anti-tool pattern | Why |
|-------------------|-----|
| Endless alpha extraction | Burns time; navy plate solves blend |
| Avatar image generation inside manuals | Violates content-first rule |
| Guessing API contracts | Check `/api/health` and MSOT |
| Lab SVG variants as masters | Schneider/poster experiments stay in `docs/graphics/` |
| Enabling Central Log early | Explicitly last to go live |

---

## 4. Templates

### 4.1 Manual cover block (text-only)

```
ARMR ALEYE
────────────────
[Product title]
[One-line subtitle]
DIG-DOC-00X  ·  Commercial Edition  ·  $XX
www.armraleye.com
```

### 4.2 Claims rewrite checklist

- [ ] No cure / heal / treat
- [ ] No guaranteed AOV, income, or ROI
- [ ] No “#1 rank” / guaranteed traffic
- [ ] No “we publish without your approval”
- [ ] Title names the anchor job (complementary, not substitute)

### 4.3 API match call (conceptual)

```json
{
  "confirm_scan": true,
  "inventory": [ { "title": "…", "type": "physical|digital|service" } ],
  "platform": "shopify"
}
```

### 4.4 API push call (conceptual)

```json
{
  "confirm_push": true,
  "channels": ["website_webhook", "social_webhook"],
  "items": [ { "title": "…", "body": "…" } ]
}
```

### 4.5 Gate unlock call (local Dynasty)

```json
{
  "method": "bypass|manual|nfc|biometric",
  "token": "armr-dev-bypass",
  "id": "ring-uid-or-rmssid",
  "status": "verified"
}
```

### 4.6 Milestone gate — definition of done

```
Phase: G0|G1|G2|G3|G4
Deliverables: …
Out of scope: …
Accept criteria: …
Claims review complete: Y/N
Payment event: …
```

### 4.7 Milestone gate — accept note

```
I confirm that phase ___ deliverables listed on [date]
meet the agreed definition of done.
Authorized name: ___    Date: ___
Next phase authorized: Y/N
```

### 4.8 MSOT change-log entry

```
**YYYY-MM-DD.N**
- Bullet of decision or lock
- Bullet of artifact shipped
- Running File advanced to rN
```

### 4.9 Navy-plate composite (Python sketch)

```python
from PIL import Image
NAVY = (10, 15, 26)  # #0A0F1A
canvas = Image.new("RGB", (W, H), NAVY)
# paste mark centered; if RGBA, use mask=mark
canvas.paste(mark, (x, y), mark if mark.mode == "RGBA" else None)
```

### 4.10 Local Dynasty env flags

```env
META_ENFORCEMENT=false
BIOMETRIC_GATE_BYPASS=true
GATE_MANUAL_TOKEN=armr-dev-bypass
CENTRAL_LOG_ENABLED=false
# GROK_API_KEY=your_key_here
```

---

## 5. How-to manuals (operator)

### 5.1 Ship a commercial DIG-DOC PDF

1. Read founder guideline / MSOT price for that SKU.  
2. Build content-first PDF (ReportLab): TOC → sections → tables → footer.  
3. **No** S'Cara avatar pages; **no** logo grids.  
4. Cover shows real list price ($67 / $67 / $127).  
5. Claims pass on every section.  
6. Upload PDF (+ zip if pack) to Drive.  
7. Status in MSOT: commercial draft → founder QC → lock.  
8. After lock: apply © ARMR ALEYE LLC notice.

### 5.2 Use the correct logo file

1. Dark background → approved JPG master **or** production-pack SVG on navy plate.  
2. Need tiny SVG → `logo_icon_simplified.svg`.  
3. Need editable strokes → `logo_icon.svg` / horizontal / vertical from production pack.  
4. JPEG noise at edges → isolate cyan → VTracer → plate (once).  
5. Never promote `docs/graphics/*schneider*` or poster experiments to masters.
6. New minimal soft-neon variant available as candidate secondary.

### 5.3 Logo SVG quick reference

| File | viewBox | Notes |
|------|---------|-------|
| simplified | `0 0 200 240` | ~669 B, minimal |
| icon (prod) | `0 0 320 400` | contour sw 4.5, traces 2.2 |
| horizontal | `0 0 640 160` | icon scale 0.36 |
| vertical | `0 0 320 440` | icon scale 0.80 |
| isolated | 784×958 | VTracer, fill `#00E5FF` |

Stroke/fill brand cyan: `#00E5FF`. Plate: `#0A0F1A`.

### 5.4 Update MSOT + Running File

1. Scan Drive for newer MSOT/Running File.  
2. Scrape session decisions.  
3. Bump MSOT version + Running File revision.  
4. Push Drive **and** GitHub `docs/`.  
5. Point “Deploy next” at the real next ship item.

### 5.5 PIE loop (field)

1. Health check API.  
2. Match with `confirm_scan: true`.  
3. Human claims rewrite.  
4. Push with `confirm_push: true` only.  
5. Verify destination; treat `not_configured` as correct failure.

### 5.6 Grok iterative logo refinement (proven)

1. Start from user feedback on current mark (e.g., “unacceptable pixelation”).  
2. Generate clean intentional base (pixel or vector-style).  
3. Iterate in small steps: resolution → detail → declutter → glow smoothness → focal element (Eye) → node balance → “less is more”.  
4. Stop when user signals approval.  
5. Save final raster, document in MSOT as candidate or master, dual-push.  
6. Apply human selection/arrangement for any copyright claim on the compilation.

### 5.7 Run local Dynasty on Termux

1. Clone `armr-aleye-dynasty` (use PAT; password auth rejected).  
2. `pkg install nodejs` if needed.  
3. `npm install`.  
4. `cp .env.example .env.local`.  
5. Start with Webpack: `npx next dev --webpack` (Turbopack fails on Android arm64).  
6. Open `http://localhost:3000` and `/dashboard`.  
7. Confirm Heartbeat ALIVE and Command Box section.

### 5.8 Doctrine check before privileged action

```ts
checkDoctrine({
  action: "…",
  preservesSequence: true,
  protectsStep1: true,
  logsSeekGodWithin: true
})
```

If `META_ENFORCEMENT=true` and checks fail → block and log.

---

## 6. Scaling & scoring systems

### 6.1 PIE match scorer (LOCKED)

```
S = 0.15A + 0.25J + 0.25C + 0.10P + 0.10B + 0.15T − p
```

| Symbol | Meaning |
|--------|---------|
| A | Anchor quality |
| J | Job fit |
| C | Complementarity |
| P | Platform fit |
| B | Bundle clarity |
| T | Title craft |
| p | Claims penalty |

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

Educational use only — no guaranteed returns language.

### 6.3 Manual commercial scale (list)

| SKU | List | Depth expectation |
|-----|------|-------------------|
| DIG-DOC-001 | $67 | Doctrine field manual — practical tests + scenarios |
| DIG-DOC-002 | $67 | Full operator TOC (match, API, workflow, troubleshoot) |
| DIG-DOC-003 | $127 | Gates G0–G4, templates, failure modes, worked examples |
| Subscriptions | $29–$399/mo | Credits + library per MSOT |

### 6.4 Delivery quality scale (internal)

| Score | Meaning | Action |
|-------|---------|--------|
| Ship | Matches brief, correct price, claims-safe, dual-pushed | Done |
| QC | Substance OK; needs founder pass | Hold lock |
| Rework | Thin, wrong price, avatar spam, or brief ignored | Rebuild section |
| Scrap | Side-quest artifact (wrong problem) | Do not upload as product |

---

## 7. Quality examples

### 7.1 Excellent quality

**Manual**
- Follows founder TOC  
- Paragraph-level operator guidance (not bullet-only fluff)  
- Tables for plans, API routes, claims allow/forbid  
- Real list price on cover  
- Zero avatar galleries; one text brand line in footer  
- Confirm gates stated as hard requirements  
- Dual-pushed to Drive + repo when locked  

**Logo**
- Approved master used on navy without forced transparency  
- SVG from production pack with documented viewBox and stroke widths  
- Isolated vector only when removing real raster noise  
- Iterative Grok refinement that ends with user “gorgeous” approval and “less is more” discipline  

**Process**
- One brief → one deliverable  
- MSOT updated the same session  
- No internal codenames in customer PDF  

**Local Dynasty**
- Doctrine check before privileged ops  
- Gate bypass only while `BIOMETRIC_GATE_BYPASS=true`  
- Central Log remains off until founder enables  
- Command Box folders initialized and listed on dashboard  

### 7.2 Poor quality

**Manual**
- Labeled $5 when list is $67–$127  
- 2–3 pages of padding for a commercial SKU  
- Full-page S'Cara / logo collages  
- Guaranteed income or medical language  
- Invented API routes  
- “Set and forget — we publish for you”  

**Logo**
- Spending hours on alpha extraction for a navy UI  
- Shipping Schneider-fit scribbles or vertical jump artifacts  
- Promoting lab `docs/graphics/*` files as brand masters  
- Over-cluttered node lines that ignore “less is more”  

**Process**
- Rebuilding the same thin PDF repeatedly  
- Ignoring a supplied guideline file  
- Side quests during a “finish the manual” ask  
- Updating neither MSOT nor Drive after a “final” claim  
- Turning Central Log on without founder OK  

### 7.3 Side-by-side (manual)

| Dimension | Excellent | Poor |
|-----------|-----------|------|
| Price on cover | $67 / $127 per MSOT | $5 or missing |
| Visuals | Text + tables | Avatar/logo spam |
| Claims | Educational only | Guarantees / medical |
| Gates | confirm_* required | Silent publish |
| Depth | Operator can run the loop | Outline with empty sections |
| Source | Guideline + MSOT | Guesswork |

### 7.4 Side-by-side (logo)

| Dimension | Excellent | Poor |
|-----------|-----------|------|
| File choice | Approved JPG/SVG master | Random generate |
| Background | Solid navy plate | Noisy JPEG bottom |
| Vector | Prod pack or clean isolate | Spike/jump paths |
| Time | Minutes to composite | Multi-hour re-extract loops |
| Iteration | Progressive declutter + soft glow + Eye refine | Over-cluttered nodes |

---

## 8. Doctrine interaction (reminder)

Toolbox methods must still obey doctrine:

1. Seek God Within — pause before push; serve real inventory need; log the source  
2. Unconditional love — no dark patterns on confirms  
3. Understanding — detect platform/context first  
4. Harmonic balance — free utility vs paid depth; human approve  
5. Higher frequency — fewer coherent offers over channel spam  

Sequence Integrity is law. Protect Step 1 at all costs.

---

## 9. Maintenance rules

1. **Append** new proven skills; do not delete history without founder OK.  
2. When a template changes, bump Toolbox version and note in Running File.  
3. Quality examples should stay concrete (file names, prices, formulas).  
4. If a tool is abandoned, mark **Deprecated** — do not silently remove.  
5. Toolbox is internal. Customer PDFs stay content-first and claims-safe.

---

## 10. Version log

**1.2 — 2026-08-07**
- Added local Dynasty skills: Doctrine-gated action, Gate unlock API, Termux Next webpack run, Command Box mirror, feature-flag last-to-live  
- Added templates: Gate unlock JSON, local env flags  
- Added how-tos: 5.7 Run local Dynasty on Termux; 5.8 Doctrine check  
- Quality examples extended for local Dynasty  
- Aligned to MSOT 2026-08-07.6 / 2026-08-07.7  

**1.1 — 2026-08-07**
- Added **Grok iterative logo refinement** skill (proven on circuit Hamsa session)  
- Added how-to 5.6 and quality notes for progressive “less is more” logo work  
- Aligned to MSOT 2026-08-07.5  

**1.0 — 2026-08-07**
- Initial Toolbox: skills, tools, templates, how-tos, PIE/PPI scoring, commercial scale, excellent vs poor examples  
- Aligned to MSOT 2026-08-07.4 and content-first manual rule  

*End Toolbox v1.2*
