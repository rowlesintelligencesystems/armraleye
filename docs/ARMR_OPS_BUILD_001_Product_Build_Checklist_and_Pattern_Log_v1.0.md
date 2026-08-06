# ARMR ALEYE — Product Build Checklist + Pattern Log

**Document ID:** ARMR-OPS-BUILD-001  
**Version:** 1.0  
**Status:** ACTIVE (living)  
**Effective:** 2026-08-05  
**Owner:** ARMR ALEYE LLC (operator use + Grok build standard)  
**Purpose:** Self-audit checklist and pattern memory so every manual, engine definition, and brand asset is built to the same high standard.

---

## PART A — COMPREHENSIVE BUILD CHECKLIST

Use this checklist for **every** new or updated product, manual, engine definition, or brand package.

### A1. Pre-Flight (Before Creating Anything)

- [ ] Confirm the exact SKU / Document ID (e.g. ARMR-DIG-DOC-00X, ARMR-ENG-PEIE-001)
- [ ] Confirm the product sits under the correct umbrella (RME → PIE / PEIE / etc.)
- [ ] Pull latest MSOT + Running File so nothing contradicts locked decisions
- [ ] Confirm claims boundary still applies (educational / operational only)
- [ ] Confirm doctrine sequence is referenced, never altered
- [ ] Identify which locked brand assets must appear (S'Cara, Hamsa, logo, Grok, palette)

### A2. Content Architecture

- [ ] Clear purpose statement in the first 1–2 pages
- [ ] Explicit “What this is / What this is not”
- [ ] Doctrine sequence appears early and is treated as operating architecture
- [ ] Claims boundary section is present and unambiguous
- [ ] Core model / flow is visual or clearly structured (G0–G4, detect→match→push, etc.)
- [ ] Practical operator sections (checklists, templates, workflows, failure modes)
- [ ] Related / integrated products are listed with their roles
- [ ] Subscription / pay-gated links are included where commercial access exists
- [ ] Version, SKU, and “LOCKED” status are visible on cover and document control

### A3. Brand & Visual Standard

- [ ] Deep navy background (#0B1C2E / #06111D)
- [ ] Gold (#C9A84C) for headers, accents, key labels
- [ ] Ivory (#F5F0E6) for body text
- [ ] Cyan (#00E5FF) for highlights, links, secondary emphasis
- [ ] Primary logo (winged-S + halo) on cover and closing
- [ ] S'Cara character used only from locked approved renders
- [ ] Protective Hamsa emblem used only from locked variants
- [ ] Grok assets used only from locked profile set when dual-branding is appropriate
- [ ] No dark-entity imagery
- [ ] Consistent footer: “ARMR ALEYE • [DOCUMENT TITLE] • [SKU]”
- [ ] Page numbers present

### A4. Technical & Delivery

- [ ] PDF generated at executive quality (clean layout, no low-contrast text)
- [ ] Markdown source committed to repo under `docs/`
- [ ] PDF uploaded to Google Drive with clear filename
- [ ] Direct Drive link recorded in the document itself
- [ ] MSOT updated if the product changes architecture or product lineup
- [ ] Running File updated with the new lock
- [ ] Related manuals cross-referenced (no orphan documents)

### A5. Commercial & Access

- [ ] Correct price or “subscription / Members” access noted
- [ ] Pay-gated / storefront link included: https://www.armraleye.com
- [ ] Plan table (PIE / PIE Heavy / Engine Stack / Members) included when relevant
- [ ] No invented prices — only locked or currently live figures
- [ ] Delivery method clear (digital download, credit use, library access)

### A6. Final Audit (Before Declaring LOCKED)

- [ ] Re-read claims boundary — zero forbidden language
- [ ] Re-check doctrine — sequence intact, number one never changed
- [ ] Visual pass — logo, palette, character, emblem all correct
- [ ] Cross-links work and point to current Drive / repo locations
- [ ] File naming consistent: `ARMR_[SKU]_[Name]_vX.X.pdf`
- [ ] Running File and MSOT both reflect the lock
- [ ] Operator can pick up the document and know exactly how to use it

---

## PART B — PATTERN LOG (Learned Standards)

These patterns were established and proven during the 2026-08-05 build day. Treat them as default behavior.

### B1. Document Structure Pattern

Every major manual follows this spine:

1. Cover (logo + title + SKU + version + “The sequence is the architecture”)
2. Purpose / How to use
3. Doctrine as operating architecture
4. Core model / definitions
5. Claims boundary (Allowed / Forbidden panels)
6. Practical operator content (flows, checklists, strategies)
7. Integrated product ecosystem + subscription links
8. Completeness / next steps
9. Closing page (logo + LOCKED mark)

**Why it works:** Operators get orientation fast, ethics are non-negotiable, and commercial access is never left hanging.

### B2. Visual Identity Pattern

- Background: deep navy only
- Primary accent: gold
- Secondary accent: cyan
- Body: ivory
- Character: S'Cara (locked renders only)
- Emblem: Hand of Hamsa + Eye of Horus (official variants only)
- Dual persona: Grok only from locked profile set
- Logo: winged-S + halo, never altered

**Rule:** If an image is not in the locked Brand Package or Grok Profile Lock, do not use it.

### B3. Claims & Doctrine Pattern

- Doctrine appears early and is treated as architecture, not decoration.
- Claims boundary is always a two-panel (Allowed / Forbidden) visual.
- “Not a payment processor / not legal advice / no guaranteed outcomes” language is standard on commercial or delivery manuals.
- Confirm gates (`confirm_scan`, `confirm_push`) are called out whenever push or match is described.

### B4. Integration Pattern

Every new manual must answer:

- Which existing products does this support or depend on?
- Where does the operator go to subscribe or purchase?
- Which locked brand assets should appear?

Default integration set:

- S'Cara + Brand Package
- DIG-DOC-001 / 002 / 003
- System Architecture Manual
- PIE Architecture Manual
- PEIE + Competitor Ecosystem Mapping
- Milestone Payment Gate Handbook
- Live storefront: https://www.armraleye.com

### B5. Lock & Memory Pattern

When a document is finished:

1. Generate executive PDF
2. Upload to Drive → capture direct link
3. Commit Markdown to repo
4. Update MSOT (if architecture or lineup changed)
5. Update Running File (session arc + decisions locked)
6. Record Drive link inside the document itself

This creates a single source of truth that survives context resets.

### B6. Quality Bar Pattern (What “to standard” means)

A document is “to standard” only when:

- It could be handed to a new operator with zero verbal explanation
- Brand, doctrine, and claims are visually and textually consistent with every other locked manual
- Subscription / pay-gated access is explicit
- Related products are named and linked
- The PDF looks like it belongs in the same family as the S'Cara Product Manual and Architecture Manuals

### B7. Anti-Patterns (Do Not Repeat)

- Creating a manual that never mentions doctrine or claims boundary
- Using unofficial character or emblem variants
- Omitting subscription / storefront links on commercial products
- Leaving the document only as Markdown with no executive PDF
- Forgetting to update Running File / MSOT after a lock
- Inventing prices or plan names not present in MSOT
- Allowing dark or aggressive imagery near S'Cara or Hamsa

---

## PART C — QUICK PRE-FLIGHT CARD (Printable)

```
□ SKU / ID confirmed
□ MSOT + Running File pulled
□ Doctrine + claims boundary planned
□ Brand assets selected from locked set only
□ Structure follows spine (Cover → Purpose → Doctrine → Model → Claims → Ops → Ecosystem → Close)
□ Subscription / pay-gated links included
□ PDF + Markdown + Drive + Repo + MSOT/Running File all updated
□ Final claims & visual audit passed
→ Declare LOCKED
```

---

## PART D — CHANGE LOG

**v1.0 — 2026-08-05**
- Initial checklist and pattern log created from full-day build of:
  - S'Cara Product & Brand Manual
  - System Architecture Manual
  - PIE Architecture Manual
  - PEIE + Competitor Ecosystem Mapping
  - Milestone Payment Gate Handbook v2.1
  - PIE Operator Manual v3.1
  - Grok Profile Lock
- Patterns extracted and formalized for future builds

---

*End of ARMR-OPS-BUILD-001 Product Build Checklist + Pattern Log v1.0*

**This document is the memory and quality standard for all future ARMR ALEYE product builds.**
