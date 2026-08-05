const DOCTRINE = ["Seek God within","Unconditional love","Understanding","Harmonic balance","Higher frequency / resonance"];
function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" },
  });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type,authorization",
      }});
    }
    if (path === "/" || path === "/api/health") {
      return json({ ok: true, service: "armraleye", brand: "ARMR ALEYE", version: "1.0-real", time: new Date().toISOString() });
    }
    if (path === "/api/catalog") {
      return json({
        ok: true,
        brand: "ARMR ALEYE",
        doctrine: DOCTRINE,
        doctrine_note: "The sequence is the architecture.",
        products: [
          { sku: "ARMR-DIG-DOC-002", title: "PIE Operator Manual v2.0", price: 67 },
          { sku: "ARMR-DIG-DOC-003", title: "Milestone Payment Gate Handbook v2.0", price: 127 },
          { sku: "ARMR-SUB-PIE", title: "Product Intelligence Engine", price_monthly: 149 }
        ]
      });
    }
    if (path === "/api/entitlements") {
      const plan = (url.searchParams.get("plan") || "PIE").toUpperCase();
      const plans = {
        PIE: { credits: 25, price_monthly: 149 },
        HEAVY: { credits: 40, price_monthly: 249 },
        STACK: { credits: 50, price_monthly: 399 }
      };
      const key = plan.includes("HEAVY") ? "HEAVY" : plan.includes("STACK") ? "STACK" : "PIE";
      return json({ ok: true, brand: "ARMR ALEYE", plan: key, entitlements: plans[key] });
    }
    if (path === "/api/pie/match" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      if (!body.confirm_scan) {
        return json({ ok: false, error: "confirm_required", prompt: "Would you like me to scan your website for product matching?" }, 400);
      }
      const inventory = Array.isArray(body.inventory) ? body.inventory : [];
      const proposals = inventory.slice(0, 25).map((item) => ({
        inventory_anchor: item.title || item.id || "item",
        proposed_digital_title: `${item.title || "Product"} — Quick-Start & Operator Checklist`,
        bundle_angle: "Free-with-purchase or checkout upsell",
        claims_boundary: "Educational/operational only. No guaranteed outcomes.",
        confidence: "M",
        credit_cost: 1,
        push_ready: true
      }));
      return json({ ok: true, brand: "ARMR ALEYE", credits_used: proposals.length, credits_limit: 25, proposals });
    }
    if (path === "/api/push" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
      if (!body.confirm_push) {
        return json({ ok: false, error: "confirm_required", prompt: "Push these assets to your connected channels?" }, 400);
      }
      return json({ ok: true, brand: "ARMR ALEYE", results: [{ channel: "website_webhook", ok: false, error: "not_configured" }] });
    }
    return json({ error: "not_found" }, 404);
  }
};
