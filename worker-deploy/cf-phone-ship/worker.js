const DOCTRINE=["Seek God within","Unconditional love","Understanding","Harmonic balance","Higher frequency / resonance"];
const DOCTRINE_NOTE="The sequence is the architecture.";
const BRAND="ARMR ALEYE";
const VERSION="3.1-trend-ppi";

// Full source lives on Drive + local systems/real/worker_trend_ppi_v3_1.js
// If this GitHub stub is incomplete, open Drive worker-3.1-trend-ppi.js
// Phone deploy: Cloudflare Connect Git → root directory worker-deploy/cf-phone-ship

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/,"") || "/";
    if (path === "/api/health" || path === "/health") {
      return Response.json({
        ok: true,
        service: "armraleye",
        brand: BRAND,
        version: VERSION,
        engine: "Revenue Multiplication Engine",
        core: "PIE",
        doctrine_note: DOCTRINE_NOTE,
        features: ["detect","match","match_scorer","push","ppi","trend","cie","aiie","session","completeness"],
        time: new Date().toISOString(),
        deploy_note: "Stub on GitHub — replace worker.js with full Drive file if routes missing"
      });
    }
    if (path === "/api/doctrine") {
      return Response.json({ ok: true, brand: BRAND, sequence: DOCTRINE, note: DOCTRINE_NOTE });
    }
    return Response.json({ error: "not_found", brand: BRAND, hint: "Upload full worker-3.1-trend-ppi.js over this file" }, { status: 404 });
  }
};
