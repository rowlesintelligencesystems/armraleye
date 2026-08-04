/** ENG-PPI API — /api/ppi + real-time ingest */
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
import {
  ingestRealtime,
  ingestBatch,
  normalizeIngestBody,
  verifyIngestSecret,
  loadRecentScored,
  ingestEndpointsDoc,
  type RealtimeIngestPayload,
} from "../lib/systems/ppi-ingest";
import { mapListingToChannel, type ChannelId } from "../lib/systems/channels";
import { dispatchWebhook } from "../lib/webhook-dispatch";

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

ppi.get("/health", (c) =>
  c.json({ ...ppiHealth(), realtimeIngest: true, endpoints: ingestEndpointsDoc() }),
);

ppi.get("/ingest/docs", (c) => c.json(ingestEndpointsDoc()));

ppi.post("/ingest", async (c) => {
  const env = c.env as Env & { PPI_INGEST_SECRET?: string };
  if (!verifyIngestSecret(env, c.req.header("authorization"), c.req.query("token"))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON" }, 400);
  const payload = normalizeIngestBody(body);
  if (!payload) {
    return c.json({ error: "title and summary (or description/body) required" }, 400);
  }
  const result = await ingestRealtime(env, payload);
  const hook = (env as { CHANNELS_ZAPIER_HOOK?: string }).CHANNELS_ZAPIER_HOOK;
  if (hook && result.scored.class === "whoppertunity") {
    await dispatchWebhook(
      hook,
      "ppi.whoppertunity",
      { signal: result.signal, scored: result.scored, brief: result.brief } as unknown as Record<
        string,
        unknown
      >,
      { source: "ppi-realtime" },
    );
  }
  return c.json(result, 201);
});

ppi.post("/ingest/batch", async (c) => {
  const env = c.env as Env & { PPI_INGEST_SECRET?: string };
  if (!verifyIngestSecret(env, c.req.header("authorization"), c.req.query("token"))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const body = await c.req.json<{ signals?: unknown[]; items?: unknown[] }>().catch(() => null);
  const rawList = (body?.signals || body?.items || []) as Record<string, unknown>[];
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return c.json({ error: "signals[] or items[] required" }, 400);
  }
  const payloads: RealtimeIngestPayload[] = [];
  for (const row of rawList) {
    const p = normalizeIngestBody(row);
    if (p) payloads.push(p);
  }
  const { results, count } = await ingestBatch(env, payloads);
  return c.json({ ok: true, count, results }, 201);
});

ppi.get("/ingest/recent", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? 20), 100);
  const fromKv = await loadRecentScored(c.env, limit);
  const fromMem = listScored().slice(0, limit);
  const opportunities = fromKv.length ? fromKv : fromMem;
  return c.json({
    count: opportunities.length,
    opportunities,
    source: fromKv.length ? "kv" : "memory",
  });
});

ppi.get("/ingest/stream", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? 10), 50);
  const fromKv = await loadRecentScored(c.env, limit);
  const list = fromKv.length ? fromKv : listScored().slice(0, limit);
  const lines = [
    `event: snapshot`,
    `data: ${JSON.stringify({ count: list.length, at: new Date().toISOString() })}`,
    ``,
  ];
  for (const item of list) {
    lines.push(`event: opportunity`);
    lines.push(`data: ${JSON.stringify(item)}`);
    lines.push(``);
  }
  lines.push(`event: done`);
  lines.push(`data: ${JSON.stringify({ ok: true })}`);
  lines.push(``);
  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

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
  const { persistSignal } = await import("../lib/systems/ppi-ingest");
  await persistSignal(c.env, signal, scored);
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
