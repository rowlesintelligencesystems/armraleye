const DOCTRINE = ["Seek God within","Unconditional love","Understanding","Harmonic balance","Higher frequency / resonance"];
const DOCTRINE_NOTE = "The sequence is the architecture.";
const BRAND = "ARMR ALEYE";
const VERSION = "2.1-scorer";

const PLATFORM_RULES = [
  { id: "shopify", label: "Shopify", confidence: "H", urlRe: [/\.myshopify\.com/i, /cdn\.shopify\.com/i, /\/cdn\/shop\//i], bodyRe: [/Shopify\.shop/i, /myshopify/i], scan_options: ["catalog","collections","public_url"], push_options: ["shopify_draft","website_webhook","social_webhook"] },
  { id: "etsy", label: "Etsy", confidence: "H", urlRe: [/etsy\.com/i], bodyRe: [/etsy\.com/i], scan_options: ["public_url"], push_options: ["website_webhook","social_webhook","csv_download"] },
  { id: "gumroad", label: "Gumroad", confidence: "H", urlRe: [/gumroad\.com/i], bodyRe: [/gumroad/i], scan_options: ["public_url"], push_options: ["website_webhook","social_webhook","csv_download"] },
  { id: "woocommerce", label: "WooCommerce", confidence: "M", urlRe: [/woocommerce/i], bodyRe: [/woocommerce/i, /wp-json\/wc\//i], scan_options: ["public_url","catalog"], push_options: ["website_webhook","social_webhook","csv_download"] },
  { id: "squarespace", label: "Squarespace", confidence: "M", urlRe: [/squarespace\.com/i], bodyRe: [/squarespace/i], scan_options: ["public_url"], push_options: ["website_webhook","social_webhook","csv_download"] },
  { id: "generic_website", label: "Website", confidence: "L", urlRe: [/^https?:\/\//i], bodyRe: [], scan_options: ["public_url"], push_options: ["website_webhook","social_webhook","csv_download"] },
];

const PLANS = {
  PIE: { credits: 25, price_monthly: 149, zap_envelope: 50 },
  HEAVY: { credits: 40, price_monthly: 249, zap_envelope: 110 },
  STACK: { credits: 50, price_monthly: 399, zap_envelope: 150 },
  MEMBERS: { credits: 0, price_monthly: 29, zap_envelope: 0 },
};

const CATALOG = [
  { sku: "ARMR-DIG-DOC-001", title: "Doctrine Architecture Manual", price: 67, type: "digital" },
  { sku: "ARMR-DIG-DOC-002", title: "PIE Operator Manual", price: 67, type: "digital" },
  { sku: "ARMR-DIG-DOC-003", title: "Milestone Payment Gate Handbook", price: 127, type: "digital" },
  { sku: "ARMR-SUB-PIE", title: "Product Intelligence Engine", price_monthly: 149, type: "subscription" },
  { sku: "ARMR-SUB-STACK", title: "Engine Stack", price_monthly: 399, type: "subscription" },
  { sku: "ARMR-SUB-MEMBERS", title: "Members Library", price_monthly: 29, type: "subscription" },
];

const JOB_WORDS = /\b(quick-?start|checklist|field guide|workbook|one-?pager|agenda|setup|care|operator|implementation|onboarding)\b/i;
const TYPE_WORDS = /\b(checklist|guide|workbook|one-?pager|manual|sop|agenda|playbook)\b/i;
const CLAIMS_BAD = /\b(guaranteed?|guarantee|cure|heal|miracle|rank #1|guaranteed sales|get rich|passive income guaranteed)\b/i;
const GENERIC_ANCHOR = /^(product|item|test|sample|untitled|sku)\b/i;

const auditBuffer = [];
const crmStore = { contacts: [], deals: [] };

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", "x-armr-brand": BRAND },
  });
}
function cors() {
  return new Response(null, {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,authorization,x-armr-scope",
    },
  });
}
async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function doctrineHash() { return sha256Hex(DOCTRINE.join("|")); }
function claimsBoundary() {
  return "Educational/operational only. No medical claims. No guaranteed income or rankings.";
}
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

function detectPlatform({ url = "", platform_hint = "", html_snippet = "" } = {}) {
  const u = String(url || "").trim();
  const hint = String(platform_hint || "").toLowerCase().trim();
  const html = String(html_snippet || "");
  if (hint) {
    const rule = PLATFORM_RULES.find((r) => r.id === hint) || PLATFORM_RULES.find((r) => r.label.toLowerCase() === hint);
    if (rule) {
      return {
        ok: true, source: "user_hint",
        detected: { id: rule.id, label: rule.label, confidence: "H" },
        scan_options: rule.scan_options, push_options: rule.push_options,
        next_prompt: "Would you like me to scan your website for product matching?",
        apps_scannable_note: "v1 scans catalog/public products you allow — not a full install audit of every third-party app.",
      };
    }
  }
  for (const rule of PLATFORM_RULES) {
    if (rule.id === "generic_website") continue;
    if (rule.urlRe.some((re) => re.test(u)) || rule.bodyRe.some((re) => re.test(html))) {
      return {
        ok: true, source: "url",
        detected: { id: rule.id, label: rule.label, confidence: rule.confidence },
        input_url: u || null, scan_options: rule.scan_options, push_options: rule.push_options,
        next_prompt: "Would you like me to scan your website for product matching?",
        message: rule.id === "shopify" ? "Shopify signals detected." : rule.label + " signals detected.",
        apps_scannable_note: "We ask which push tools you use. We do not silently inventory every installed app in v1.",
      };
    }
  }
  if (/^https?:\/\//i.test(u)) {
    return {
      ok: true, source: "url",
      detected: { id: "generic_website", label: "Website", confidence: "L" },
      input_url: u, scan_options: ["public_url"],
      push_options: ["website_webhook", "social_webhook", "csv_download"],
      next_prompt: "Would you like me to scan your website for product matching?",
    };
  }
  return {
    ok: true, source: "none", detected: null, prompt: "Where do you sell?",
    choices: [{ id: "shopify", label: "Shopify" }, { id: "website", label: "Website only" }, { id: "etsy", label: "Etsy" }, { id: "other", label: "Other / not sure" }],
  };
}

function scoreAnchorQuality(anchor) {
  const title = String(anchor.title || anchor.id || "").trim();
  if (!title) return 0.05;
  let s = 0.45;
  if (title.length >= 8) s += 0.2;
  if (title.length >= 16) s += 0.1;
  if (anchor.category) s += 0.15;
  if (GENERIC_ANCHOR.test(title)) s -= 0.35;
  if (/\d/.test(title) || /[-—:]/.test(title)) s += 0.05;
  return clamp(s, 0, 1);
}
function scoreJobFit(title) {
  const t = String(title || "");
  let s = 0.25;
  if (JOB_WORDS.test(t)) s += 0.45;
  if (TYPE_WORDS.test(t)) s += 0.2;
  if (/\bfor\b/i.test(t)) s += 0.1;
  return clamp(s, 0, 1);
}
function scoreComplementarity(anchorTitle, proposalTitle) {
  const a = String(anchorTitle || "").toLowerCase();
  const p = String(proposalTitle || "").toLowerCase();
  let s = 0.35;
  if (a && p.includes(a.slice(0, Math.min(12, a.length)))) s += 0.35;
  if (TYPE_WORDS.test(p)) s += 0.25;
  if (a && p === a) s = 0.15;
  return clamp(s, 0, 1);
}
function scorePlatformFit(recommended, pushOptions) {
  const rec = Array.isArray(recommended) ? recommended : [];
  const opts = Array.isArray(pushOptions) ? pushOptions : [];
  if (!rec.length || !opts.length) return 0.5;
  const hit = rec.filter((c) => opts.includes(c)).length;
  if (hit === rec.length) return 1;
  if (hit > 0) return 0.55;
  return 0.2;
}
function scoreBundleClarity(angle) {
  const a = String(angle || "").trim();
  if (!a) return 0.25;
  let s = 0.55;
  if (/free-with-purchase|checkout|post-purchase|upsell|bundle/i.test(a)) s += 0.3;
  if (a.length > 12) s += 0.1;
  return clamp(s, 0, 1);
}
function scoreTitleCraft(anchorTitle, proposalTitle) {
  const a = String(anchorTitle || "").trim();
  const p = String(proposalTitle || "").trim();
  let s = 0.2;
  if (a && p.toLowerCase().includes(a.toLowerCase())) s += 0.35;
  if (/—|--| - /.test(p)) s += 0.2;
  if (TYPE_WORDS.test(p)) s += 0.2;
  if (p.length >= 20 && p.length <= 90) s += 0.1;
  return clamp(s, 0, 1);
}
function claimsPenalty(text) {
  const t = String(text || "");
  let p = 0;
  if (CLAIMS_BAD.test(t)) p += 0.4;
  if (/\b(miracle|heal|cure)\b/i.test(t)) p += 0.15;
  return clamp(p, 0, 0.5);
}

function scoreProposal({ anchor, title, bundle_angle, recommended_channels, push_options }) {
  const A = scoreAnchorQuality(anchor);
  const J = scoreJobFit(title);
  const C = scoreComplementarity(anchor.title || anchor.id, title);
  const P = scorePlatformFit(recommended_channels, push_options);
  const B = scoreBundleClarity(bundle_angle);
  const T = scoreTitleCraft(anchor.title || anchor.id, title);
  const penalty = claimsPenalty(`${title} ${bundle_angle}`);
  const score = clamp(0.15 * A + 0.25 * J + 0.25 * C + 0.1 * P + 0.1 * B + 0.15 * T - penalty, 0, 1);
  let confidence = "L";
  if (score >= 0.75) confidence = "H";
  else if (score >= 0.45) confidence = "M";
  const rewrite_flags = [];
  if (A < 0.4) rewrite_flags.push("weak_anchor");
  if (J < 0.45) rewrite_flags.push("missing_job");
  if (C < 0.45) rewrite_flags.push("low_complementarity");
  if (T < 0.45) rewrite_flags.push("title_craft");
  if (penalty >= 0.3) rewrite_flags.push("claims_risk");
  if (B < 0.4) rewrite_flags.push("weak_bundle_angle");
  const push_ready = confidence !== "L" && penalty < 0.3;
  return {
    score: Math.round(score * 1000) / 1000,
    confidence,
    score_breakdown: {
      anchor_quality: Math.round(A * 1000) / 1000,
      job_fit: Math.round(J * 1000) / 1000,
      complementarity: Math.round(C * 1000) / 1000,
      platform_fit: Math.round(P * 1000) / 1000,
      bundle_clarity: Math.round(B * 1000) / 1000,
      title_craft: Math.round(T * 1000) / 1000,
      penalty: Math.round(penalty * 1000) / 1000,
    },
    rewrite_flags,
    push_ready,
  };
}

function buildProposal(item, platform) {
  const anchorTitle = item.title || item.id || "item";
  const title = `${anchorTitle} — Quick-Start & Operator Checklist`;
  const bundle_angle = "Free-with-purchase or checkout upsell";
  const recommended_channels = (platform.detected && platform.push_options) || ["website_webhook", "social_webhook"];
  const scored = scoreProposal({
    anchor: item, title, bundle_angle, recommended_channels,
    push_options: platform.push_options || recommended_channels,
  });
  return {
    inventory_anchor: anchorTitle,
    proposed_digital_title: title,
    bundle_angle,
    claims_boundary: claimsBoundary(),
    confidence: scored.confidence,
    score: scored.score,
    score_breakdown: scored.score_breakdown,
    rewrite_flags: scored.rewrite_flags,
    credit_cost: 1,
    push_ready: scored.push_ready,
    recommended_channels,
  };
}

function scorePPI({ trend = 0.5, margin = 0.5, timing = 0.5, differentiation = 0.5 } = {}) {
  const score = 0.3 * Number(trend) + 0.25 * Number(margin) + 0.25 * Number(timing) + 0.2 * Number(differentiation);
  let label = "watch";
  if (score >= 0.75) label = "whoopertunity";
  else if (score < 0.35) label = "floppertunity";
  return { score: Math.round(score * 1000) / 1000, label, claims_boundary: claimsBoundary(), note: "Educational scoring only — not financial advice." };
}

async function audit(event, payload = {}) {
  const entry = { id: crypto.randomUUID(), ts: new Date().toISOString(), event, payload };
  entry.integrity = await sha256Hex(JSON.stringify(payload));
  auditBuffer.unshift(entry);
  if (auditBuffer.length > 100) auditBuffer.pop();
  return entry;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") return cors();

    if (path === "/" || path === "/api/health") {
      const dhash = await doctrineHash();
      return json({
        ok: true, service: "armraleye", brand: BRAND, version: VERSION,
        engine: "Revenue Multiplication Engine", core: "PIE",
        doctrine_note: DOCTRINE_NOTE, doctrine_hash: dhash,
        features: ["detect", "match", "match_scorer", "push", "catalog", "entitlements", "ppi", "crm", "audit", "systems"],
        time: new Date().toISOString(),
      });
    }

    if (path === "/api/systems") {
      return json({
        ok: true, brand: BRAND, version: VERSION,
        rme: "Revenue Multiplication Engine", registry: "v3.1",
        live: ["health", "catalog", "entitlements", "detect", "match", "match_scorer", "push", "ppi", "crm", "audit", "doctrine"],
        claims_boundary: claimsBoundary(),
      });
    }

    if (path === "/api/doctrine") {
      const dhash = await doctrineHash();
      return json({ ok: true, brand: BRAND, sequence: DOCTRINE, note: DOCTRINE_NOTE, hash: dhash, immutable: true });
    }

    if (path === "/api/catalog") {
      return json({ ok: true, brand: BRAND, doctrine: DOCTRINE, doctrine_note: DOCTRINE_NOTE, claims_boundary: claimsBoundary(), products: CATALOG });
    }

    if (path === "/api/entitlements") {
      const plan = (url.searchParams.get("plan") || "PIE").toUpperCase();
      const key = plan.includes("HEAVY") ? "HEAVY" : plan.includes("STACK") ? "STACK" : plan.includes("MEMBER") ? "MEMBERS" : "PIE";
      return json({ ok: true, brand: BRAND, plan: key, entitlements: PLANS[key] });
    }

    if (path === "/api/pie/detect") {
      let body = {};
      if (request.method === "POST") {
        try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      } else {
        body = { url: url.searchParams.get("url") || "", platform_hint: url.searchParams.get("hint") || "" };
      }
      const result = detectPlatform(body);
      await audit("pie.detect", { source: result.source, detected: result.detected });
      return json({ brand: BRAND, ...result });
    }

    if (path === "/api/pie/match" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      if (!body.confirm_scan) {
        return json({ ok: false, error: "confirm_required", prompt: "Would you like me to scan your website for product matching?" }, 400);
      }
      const platform = detectPlatform({
        url: body.url || body.store_url || "",
        platform_hint: body.platform || body.platform_hint || "",
        html_snippet: body.html_snippet || "",
      });
      const inventory = Array.isArray(body.inventory) ? body.inventory : [];
      const proposals = inventory.slice(0, 25).map((item) => buildProposal(item, platform));
      const avg = proposals.length ? proposals.reduce((s, p) => s + (p.score || 0), 0) / proposals.length : 0;
      await audit("pie.match", { count: proposals.length, avg_score: Math.round(avg * 1000) / 1000 });
      return json({
        ok: true, brand: BRAND, engine: "Revenue Multiplication Engine", scorer: "v1",
        platform, credits_used: proposals.length, credits_limit: 25, proposals,
        push_prompt: "Push these assets to your connected channels?",
      });
    }

    if (path === "/api/pie/score" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const anchor = body.anchor || { title: body.inventory_anchor || "Anchor" };
      const title = body.proposed_digital_title || body.title || "";
      const bundle_angle = body.bundle_angle || "";
      const recommended_channels = body.recommended_channels || ["website_webhook", "social_webhook"];
      const push_options = body.push_options || recommended_channels;
      const scored = scoreProposal({ anchor, title, bundle_angle, recommended_channels, push_options });
      await audit("pie.score", { score: scored.score, confidence: scored.confidence });
      return json({
        ok: true, brand: BRAND, scorer: "v1",
        inventory_anchor: anchor.title || anchor.id,
        proposed_digital_title: title, bundle_angle, ...scored,
        claims_boundary: claimsBoundary(),
      });
    }

    if (path === "/api/push" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      if (!body.confirm_push) {
        return json({ ok: false, error: "confirm_required", prompt: "Push these assets to your connected channels?" }, 400);
      }
      const channels = Array.isArray(body.channels) ? body.channels : ["website_webhook", "social_webhook"];
      const results = [];
      for (const ch of channels) {
        let hook = null;
        if (ch === "website_webhook") hook = env.WEBSITE_WEBHOOK_URL;
        if (ch === "social_webhook") hook = env.SOCIAL_WEBHOOK_URL;
        if (ch === "email_webhook") hook = env.EMAIL_WEBHOOK_URL;
        if (ch === "shopify_draft") {
          results.push({ channel: ch, ok: false, error: env.SHOPIFY_TOKEN ? "shopify_adapter_pending" : "not_configured" });
          continue;
        }
        if (!hook) { results.push({ channel: ch, ok: false, error: "not_configured" }); continue; }
        try {
          const r = await fetch(hook, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              source: "ARMR_ALEYE", brand: BRAND, engine: "Revenue Multiplication Engine",
              event: "push.assets", channel: ch, product: body.product || null, assets: body.assets || null,
              claims_boundary: claimsBoundary(), time: new Date().toISOString(),
            }),
          });
          results.push({ channel: ch, ok: r.ok, status: r.status });
        } catch (e) {
          results.push({ channel: ch, ok: false, error: String(e) });
        }
      }
      await audit("push", { results });
      return json({ ok: true, brand: BRAND, results });
    }

    if (path === "/api/ppi/score" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const result = scorePPI(body);
      await audit("ppi.score", result);
      return json({ ok: true, brand: BRAND, ...result });
    }

    if (path === "/api/crm/contacts" && request.method === "GET") {
      return json({ ok: true, brand: BRAND, contacts: crmStore.contacts.slice(0, 100) });
    }
    if (path === "/api/crm/contacts" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const contact = {
        id: crypto.randomUUID(), email: body.email || null, name: body.name || null,
        stage: body.stage || "lead", platform: body.platform || null, created: new Date().toISOString(),
      };
      crmStore.contacts.unshift(contact);
      await audit("crm.contact_create", { id: contact.id });
      return json({ ok: true, brand: BRAND, contact });
    }

    if (path === "/api/audit/events" && request.method === "GET") {
      return json({ ok: true, brand: BRAND, events: auditBuffer.slice(0, 50), note: "Ephemeral edge buffer." });
    }

    if (path === "/api/milestone/schema") {
      return json({
        ok: true, brand: BRAND,
        gates: [
          { id: "G0", name: "Discovery", pct: 10 }, { id: "G1", name: "Architecture", pct: 20 },
          { id: "G2", name: "Build", pct: 30 }, { id: "G3", name: "Validate", pct: 20 },
          { id: "G4", name: "Handoff", pct: 20 },
        ],
        claims_boundary: claimsBoundary(),
      });
    }

    return json({ error: "not_found", brand: BRAND }, 404);
  },
};
