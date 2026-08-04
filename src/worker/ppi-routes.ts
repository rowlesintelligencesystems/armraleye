/** ENG-PPI API — /api/ppi */
import { Hono } from "hono";
import type { Env } from "../lib/types";
import {
  ingestSignal,
  listScored,
  listSignals,
  getScored,
  runPipeline,
  ppiHealth,
  toProductBrief,
  classifyWhoppertunity,
  type TrendSignal,
} from "../lib/systems/ppi";
import { mapListingToChannel, type ChannelId } from "../lib/systems/channels";

function isAuthorized(c: {
  env: Env;
  req: { header: (k: string) => string | undefined };
}): boolean {
  const configured = c.env.ADMIN_TOKEN;
  if (!configured) return false;
  const header = c.req.header("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  return token.length > 0 && token === configured;
}

const ppi = new Hono<{ Bindings: Env }>();

ppi.get("/health", (c) => c.json(ppiHealth()));
ppi.get("/signals", (c) => c.json({ signals: listSignals() }));
ppi.get("/opportunities", (c) => c.json({ opportunities: listScored() }));
ppi.get("/whoppertunities", (c) => {
  const list = listScored().filter((s) => s.class === "whoppertunity");
  return c.json({ count: list.length, whoppertunities: list });
});

ppi.get("/opportunities/:id", (c) => {
  const s = getScored(c.req.param("id"));
  if (!s) return c.json({ error: "Not found" }, 404);
  return c.json({ scored: s, classification: classifyWhoppertunity(s), brief: toProductBrief(s) });
});

ppi.post("/signals", async (c) => {
  if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json().catch(() => null);
  if (!body?.title || !body?.summary || !body?.source) {
    return c.json({ error: "title, summary, source required" }, 400);
  }
  const signal = ingestSignal(body);
  const scored = getScored(signal.id)!;
  return c.json(
    { signal, scored, classification: classifyWhoppertunity(scored), brief: toProductBrief(scored) },
    201,
  );
});

ppi.post("/score", async (c) => {
  const body = await c.req.json<TrendSignal>().catch(() => null);
  if (!body?.title || !body?.summary) return c.json({ error: "title and summary required" }, 400);
  const signal: TrendSignal = {
    id: body.id || `tmp_${Date.now()}`,
    title: body.title,
    summary: body.summary,
    source: body.source || "manual",
    rawTags: body.rawTags || [],
    urgency: body.urgency,
    profitability: body.profitability,
    competition: body.competition,
    ecosystemFit: body.ecosystemFit,
    marketCeilingHint: body.marketCeilingHint,
    observedAt: body.observedAt || new Date().toISOString(),
  };
  return c.json(runPipeline(signal));
});

ppi.get("/opportunities/:id/placement", (c) => {
  const s = getScored(c.req.param("id"));
  if (!s) return c.json({ error: "Not found" }, 404);
  const brief = toProductBrief(s);
  if (!brief) return c.json({ placement: s.placement, brief: null, fanout: [] });
  const master = {
    sku: brief.suggestedSku,
    title: brief.suggestedTitle,
    description: `${s.title}. ${s.productHints.join(" ")}. Built via ARMR Product Engine. Hand of Hamsa packaging mark. Not medical advice.`,
    priceUsd: brief.priceBandUsd,
    tags: ["digital", "ARMR", "product-engine"],
    packagingMark: "Hand of Hamsa\u2122",
    cta: `Get ${brief.suggestedTitle}`,
  };
  const fanout = brief.channelPriority.map((ch) => mapListingToChannel(master, ch as ChannelId));
  return c.json({
    placement: s.placement,
    brief,
    productEngine: {
      morphFrom: "ARMR Product Engine",
      action:
        brief.placement.status === "now" || brief.placement.status === "soon"
          ? "Run Product Engine package → publish fanout channels"
          : "Hold — do not publish yet",
    },
    fanout,
  });
});

export default ppi;
