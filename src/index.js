const DOCTRINE = ["Seek God within","Unconditional love","Understanding","Harmonic balance","Higher frequency / resonance"];
const DOCTRINE_NOTE = "The sequence is the architecture.";
const BRAND = "ARMR ALEYE";
const VERSION = "2.0-systems";
const PLATFORM_RULES = [
  { id: "shopify", label: "Shopify", confidence: "H", urlRe: [/\.myshopify\.com/i, /cdn\.shopify\.com/i, /\/cdn\/shop\//i], bodyRe: [/Shopify\.shop/i, /myshopify/i], scan_options: ["catalog", "collections", "public_url"], push_options: ["shopify_draft", "website_webhook", "social_webhook"] },
  { id: "etsy", label: "Etsy", confidence: "H", urlRe: [/etsy\.com/i], bodyRe: [/etsy\.com/i], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "gumroad", label: "Gumroad", confidence: "H", urlRe: [/gumroad\.com/i], bodyRe: [/gumroad/i], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "woocommerce", label: "WooCommerce", confidence: "M", urlRe: [/woocommerce/i], bodyRe: [/woocommerce/i, /wp-json\/wc\//i], scan_options: ["public_url", "catalog"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "squarespace", label: "Squarespace", confidence: "M", urlRe: [/squarespace\.com/i], bodyRe: [/squarespace/i], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "generic_website", label: "Website", confidence: "L", urlRe: [/^https?:\/\//i], bodyRe: [], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] }
];
const PLANS = { PIE: { credits: 25, price_monthly: 149, zap_envelope: 50 }, HEAVY: { credits: 40, price_monthly: 249, zap_envelope: 110 }, STACK: { credits: 50, price_monthly: 399, zap_envelope: 150 }, MEMBERS: { credits: 0, price_monthly: 29, zap_envelope: 0 } };
const CATALOG = [
  { sku: "ARMR-DIG-DOC-001", title: "Doctrine Architecture Manual", price: 67, type: "digital" },
  { sku: "ARMR-DIG-DOC-002", title: "PIE Operator Manual v2.0", price: 67, type: "digital" },
  { sku: "ARMR-DIG-DOC-003", title: "Milestone Payment Gate Handbook v2.0", price: 127, type: "digital" },
  { sku: "ARMR-SUB-PIE", title: "Product Intelligence Engine", price_monthly: 149, type: "subscription" },
  { sku: "ARMR-SUB-STACK", title: "Engine Stack", price_monthly: 399, type: "subscription" },
  { sku: "ARMR-SUB-MEMBERS", title: "Members Library", price_monthly: 29, type: "subscription" }
];
const auditBuffer = [];
const crmStore = { contacts: [], deals: [] };
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", "x-armr-brand": BRAND } });
}
function cors() {
  return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type,authorization,x-armr-scope" } });
}
async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function doctrineHash() { return sha256Hex(DOCTRINE.join("|")); }
function claimsBoundary() { return "Educational/operational only. No medical claims. No guaranteed income or rankings."; }
function detectPlatform({ url = "", platform_hint = "", html_snippet = "" } = {}) {
  const u = String(url || "").trim();
  const hint = String(platform_hint || "").toLowerCase().trim();
  const html = String(html_snippet || "");
  if (hint) {
    const rule = PLATFORM_RULES.find((r) => r.id === hint) || PLATFORM_RULES.find((r) => r.label.toLowerCase() === hint);
    if (rule) return { ok: true, source: "user_hint", detected: { id: rule.id, label: rule.label, confidence: "H" }, scan_options: rule.scan_options, push_options: rule.push_options, next_prompt: "Would you like me to scan your website for product matching?", apps_scannable_note: "v1 scans catalog/public products you allow — not a full install audit of every third-party app." };
  }
  for (const rule of PLATFORM_RULES) {
    if (rule.id === "generic_website") continue;
    if (rule.urlRe.some((re) => re.test(u)) || rule.bodyRe.some((re) => re.test(html))) {
      return { ok: true, source: "url", detected: { id: rule.id, label: rule.label, confidence: rule.confidence }, input_url: u || null, scan_options: rule.scan_options, push_options: rule.push_options, next_prompt: "Would you like me to scan your website for product matching?", message: rule.id === "shopify" ? "Shopify signals detected." : rule.label + " signals detected.", apps_scannable_note: "We ask which push tools you use. We do not silently inventory every installed app in v1." };
    }
  }
  if (/^https?:\/\//i.test(u)) return { ok: true, source: "url", detected: { id: "generic_website", label: "Website", confidence: "L" }, input_url: u, scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"], next_prompt: "Would you like me to scan your website for product matching?" };
  return { ok: true, source: "none", detected: null, prompt: "Where do you sell?", choices: [{ id: "shopify", label: "Shopify" }, { id: "website", label: "Website only" }, { id: "etsy", label: "Etsy" }, { id: "other", label: "Other / not sure" }] };
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
      return json({ ok: true, service: "armraleye", brand: BRAND, version: VERSION, doctrine_note: DOCTRINE_NOTE, doctrine_hash: dhash, features: ["detect", "match", "push", "catalog", "entitlements", "ppi", "crm", "audit", "systems"], time: new Date().toISOString() });
    }
    if (path === "/api/systems") return json({ ok: true, brand: BRAND, version: VERSION, registry: "v3.0", live: ["health", "catalog", "entitlements", "detect", "match", "push", "ppi", "crm", "audit", "doctrine"], claims_boundary: claimsBoundary() });
    if (path === "/api/doctrine") {
      const dhash = await doctrineHash();
      return json({ ok: true, brand: BRAND, sequence: DOCTRINE, note: DOCTRINE_NOTE, hash: dhash, immutable: true });
    }
    if (path === "/api/doctrine/verify" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const current = await doctrineHash();
      const ok = body.hash && body.hash === current;
      await audit("doctrine.verify", { ok });
      return json({ ok, brand: BRAND, current_hash: current, immutable: true });
    }
    if (path === "/api/catalog") return json({ ok: true, brand: BRAND, doctrine: DOCTRINE, doctrine_note: DOCTRINE_NOTE, claims_boundary: claimsBoundary(), products: CATALOG });
    if (path === "/api/entitlements") {
      const plan = (url.searchParams.get("plan") || "PIE").toUpperCase();
      const key = plan.includes("HEAVY") ? "HEAVY" : plan.includes("STACK") ? "STACK" : plan.includes("MEMBER") ? "MEMBERS" : "PIE";
      return json({ ok: true, brand: BRAND, plan: key, entitlements: PLANS[key] });
    }
    if (path === "/api/pie/detect") {
      let body = {};
      if (request.method === "POST") { try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); } }
      else body = { url: url.searchParams.get("url") || "", platform_hint: url.searchParams.get("hint") || "" };
      const result = detectPlatform(body);
      await audit("pie.detect", { source: result.source, detected: result.detected });
      return json({ brand: BRAND, ...result });
    }
    if (path === "/api/pie/match" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      if (!body.confirm_scan) return json({ ok: false, error: "confirm_required", prompt: "Would you like me to scan your website for product matching?" }, 400);
      const platform = detectPlatform({ url: body.url || body.store_url || "", platform_hint: body.platform || body.platform_hint || "", html_snippet: body.html_snippet || "" });
      const inventory = Array.isArray(body.inventory) ? body.inventory : [];
      const proposals = inventory.slice(0, 25).map((item) => ({
        inventory_anchor: item.title || item.id || "item",
        proposed_digital_title: (item.title || "Product") + " — Quick-Start & Operator Checklist",
        bundle_angle: "Free-with-purchase or checkout upsell",
        claims_boundary: claimsBoundary(),
        confidence: "M",
        credit_cost: 1,
        push_ready: true,
        recommended_channels: (platform.detected && platform.push_options) || ["website_webhook", "social_webhook"]
      }));
      await audit("pie.match", { count: proposals.length });
      return json({ ok: true, brand: BRAND, platform, credits_used: proposals.length, credits_limit: 25, proposals, push_prompt: "Push these assets to your connected channels?" });
    }
    if (path === "/api/push" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      if (!body.confirm_push) return json({ ok: false, error: "confirm_required", prompt: "Push these assets to your connected channels?" }, 400);
      const channels = Array.isArray(body.channels) ? body.channels : ["website_webhook", "social_webhook"];
      const results = [];
      for (const ch of channels) {
        let hook = null;
        if (ch === "website_webhook") hook = env.WEBSITE_WEBHOOK_URL;
        if (ch === "social_webhook") hook = env.SOCIAL_WEBHOOK_URL;
        if (ch === "email_webhook") hook = env.EMAIL_WEBHOOK_URL;
        if (ch === "shopify_draft") { results.push({ channel: ch, ok: false, error: env.SHOPIFY_TOKEN ? "shopify_adapter_pending" : "not_configured" }); continue; }
        if (!hook) { results.push({ channel: ch, ok: false, error: "not_configured" }); continue; }
        try {
          const r = await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source: "ARMR_ALEYE", brand: BRAND, event: "push.assets", channel: ch, product: body.product || null, assets: body.assets || null, claims_boundary: claimsBoundary(), time: new Date().toISOString() }) });
          results.push({ channel: ch, ok: r.ok, status: r.status });
        } catch (e) { results.push({ channel: ch, ok: false, error: String(e) }); }
      }
      await audit("push", { results });
      return json({ ok: true, brand: BRAND, results });
    }
    if (path === "/api/ppi/score" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const result = scorePPI(body);
      await audit("ppi.score", result);
      return json({ ok: true, brand: BRAND, ...result });
    }
    if (path === "/api/crm/contacts" && request.method === "GET") return json({ ok: true, brand: BRAND, contacts: crmStore.contacts.slice(0, 100) });
    if (path === "/api/crm/contacts" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const contact = { id: crypto.randomUUID(), email: body.email || null, name: body.name || null, stage: body.stage || "lead", platform: body.platform || null, created: new Date().toISOString() };
      crmStore.contacts.unshift(contact);
      await audit("crm.contact_create", { id: contact.id });
      if (env.CRM_WEBHOOK_URL) { try { await fetch(env.CRM_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ brand: BRAND, event: "crm.contact", contact }) }); } catch (_) {} }
      return json({ ok: true, brand: BRAND, contact });
    }
    if (path === "/api/crm/deals" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const deal = { id: crypto.randomUUID(), title: body.title || "Deal", stage: body.stage || "qualified", value: body.value || 0, created: new Date().toISOString() };
      crmStore.deals.unshift(deal);
      await audit("crm.deal_create", { id: deal.id });
      return json({ ok: true, brand: BRAND, deal });
    }
    if (path === "/api/audit/events" && request.method === "GET") return json({ ok: true, brand: BRAND, events: auditBuffer.slice(0, 50), note: "Ephemeral edge buffer — wire KV/D1 for persistence." });
    if (path === "/api/audit/event" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      const entry = await audit(body.event || "custom", body.payload || {});
      return json({ ok: true, brand: BRAND, entry });
    }
    if (path === "/api/milestone/schema") return json({ ok: true, brand: BRAND, gates: [{ id: "G0", name: "Discovery", pct: 10 }, { id: "G1", name: "Architecture", pct: 20 }, { id: "G2", name: "Build", pct: 30 }, { id: "G3", name: "Validate", pct: 20 }, { id: "G4", name: "Handoff", pct: 20 }], claims_boundary: claimsBoundary() });
    if (path === "/api/ops/webhook-schema") return json({ ok: true, brand: BRAND, events: ["push.assets", "pie.match", "crm.contact", "crm.deal", "audit.event"], channels: ["website_webhook", "social_webhook", "email_webhook", "crm_webhook"], secrets: ["WEBSITE_WEBHOOK_URL", "SOCIAL_WEBHOOK_URL", "EMAIL_WEBHOOK_URL", "CRM_WEBHOOK_URL", "SHOPIFY_SHOP", "SHOPIFY_TOKEN"] });
    return json({ error: "not_found", brand: BRAND }, 404);
  }
};
