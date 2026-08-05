const DOCTRINE = ["Seek God within","Unconditional love","Understanding","Harmonic balance","Higher frequency / resonance"];
const PLATFORM_RULES = [
  { id: "shopify", label: "Shopify", confidence: "H", urlRe: [/\.myshopify\.com/i, /cdn\.shopify\.com/i, /\/cdn\/shop\//i], bodyRe: [/Shopify\.shop/i, /myshopify/i, /cdn\.shopify\.com/i], scan_options: ["catalog", "collections", "public_url"], push_options: ["shopify_draft", "website_webhook", "social_webhook"] },
  { id: "etsy", label: "Etsy", confidence: "H", urlRe: [/etsy\.com/i], bodyRe: [/etsy\.com/i], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "gumroad", label: "Gumroad", confidence: "H", urlRe: [/gumroad\.com/i], bodyRe: [/gumroad/i], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "woocommerce", label: "WooCommerce", confidence: "M", urlRe: [/woocommerce/i], bodyRe: [/woocommerce/i, /wp-json\/wc\//i], scan_options: ["public_url", "catalog"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "squarespace", label: "Squarespace", confidence: "M", urlRe: [/squarespace\.com/i], bodyRe: [/squarespace/i], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] },
  { id: "generic_website", label: "Website", confidence: "L", urlRe: [/^https?:\/\//i], bodyRe: [], scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"] }
];
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" } });
}
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
    const urlHit = rule.urlRe.some((re) => re.test(u));
    const bodyHit = rule.bodyRe.some((re) => re.test(html));
    if (urlHit || bodyHit) {
      return { ok: true, source: urlHit ? "url" : "html_snippet", detected: { id: rule.id, label: rule.label, confidence: rule.confidence }, input_url: u || null, scan_options: rule.scan_options, push_options: rule.push_options, next_prompt: "Would you like me to scan your website for product matching?", message: rule.id === "shopify" ? "Shopify signals detected. You can scan catalog/public products, then push to Shopify draft, website, and social." : rule.label + " signals detected. You can scan public products, then push to website and social.", apps_scannable_note: "We ask which push tools you use (Shopify, website webhook, social). We do not silently inventory every installed app in v1." };
    }
  }
  if (/^https?:\/\//i.test(u)) {
    return { ok: true, source: "url", detected: { id: "generic_website", label: "Website", confidence: "L" }, input_url: u, scan_options: ["public_url"], push_options: ["website_webhook", "social_webhook", "csv_download"], next_prompt: "Would you like me to scan your website for product matching?", message: "Website URL detected. Confirm scan to propose complementary digitals." };
  }
  return { ok: true, source: "none", detected: null, prompt: "Where do you sell?", choices: [{ id: "shopify", label: "Shopify" }, { id: "website", label: "Website only" }, { id: "etsy", label: "Etsy" }, { id: "other", label: "Other / not sure" }] };
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type,authorization" } });
    if (path === "/" || path === "/api/health") return json({ ok: true, service: "armraleye", brand: "ARMR ALEYE", version: "1.1-real", features: ["detect", "match", "push", "catalog", "entitlements"], time: new Date().toISOString() });
    if (path === "/api/catalog") return json({ ok: true, brand: "ARMR ALEYE", doctrine: DOCTRINE, doctrine_note: "The sequence is the architecture.", products: [{ sku: "ARMR-DIG-DOC-002", title: "PIE Operator Manual v2.0", price: 67 }, { sku: "ARMR-DIG-DOC-003", title: "Milestone Payment Gate Handbook v2.0", price: 127 }, { sku: "ARMR-SUB-PIE", title: "Product Intelligence Engine", price_monthly: 149 }] });
    if (path === "/api/entitlements") {
      const plan = (url.searchParams.get("plan") || "PIE").toUpperCase();
      const plans = { PIE: { credits: 25, price_monthly: 149 }, HEAVY: { credits: 40, price_monthly: 249 }, STACK: { credits: 50, price_monthly: 399 } };
      const key = plan.includes("HEAVY") ? "HEAVY" : plan.includes("STACK") ? "STACK" : "PIE";
      return json({ ok: true, brand: "ARMR ALEYE", plan: key, entitlements: plans[key] });
    }
    if (path === "/api/pie/detect" && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      return json({ brand: "ARMR ALEYE", ...detectPlatform(body) });
    }
    if (path === "/api/pie/detect" && request.method === "GET") {
      return json({ brand: "ARMR ALEYE", ...detectPlatform({ url: url.searchParams.get("url") || "", platform_hint: url.searchParams.get("hint") || "" }) });
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
        claims_boundary: "Educational/operational only. No guaranteed outcomes.",
        confidence: "M",
        credit_cost: 1,
        push_ready: true,
        recommended_channels: (platform.detected && platform.push_options) || ["website_webhook", "social_webhook"]
      }));
      return json({ ok: true, brand: "ARMR ALEYE", platform, credits_used: proposals.length, credits_limit: 25, proposals, push_prompt: "Push these assets to your connected channels?" });
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
        if (!hook) { results.push({ channel: ch, ok: false, error: "not_configured" }); continue; }
        try {
          const r = await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source: "ARMR_ALEYE", brand: "ARMR ALEYE", event: "push.assets", channel: ch, product: body.product || null, assets: body.assets || null, time: new Date().toISOString() }) });
          results.push({ channel: ch, ok: r.ok, status: r.status });
        } catch (e) { results.push({ channel: ch, ok: false, error: String(e) }); }
      }
      return json({ ok: true, brand: "ARMR ALEYE", results });
    }
    return json({ error: "not_found" }, 404);
  }
};
