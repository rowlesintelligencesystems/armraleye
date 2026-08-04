/**
 * ENG-PPI — Real-time signal ingestion
 */
import type { Env } from "../types";
import {
  type TrendSignal,
  type SignalSource,
  type ScoredOpportunity,
  runPipeline,
  classifyWhoppertunity,
  type PpiProductBrief,
} from "./ppi";

const KV_SIGNAL = (id: string) => `ppi:signal:${id}`;
const KV_SCORED = (id: string) => `ppi:scored:${id}`;
const KV_INDEX = "ppi:index";
const KV_RECENT = "ppi:recent";
const MAX_RECENT = 100;

export type IngestSourceAdapter =
  | "webhook"
  | "zapier"
  | "manual"
  | "rss"
  | "forum"
  | "competitor"
  | "shopify_feedback"
  | "generic";

export interface RealtimeIngestPayload {
  title: string;
  summary: string;
  source?: SignalSource;
  adapter?: IngestSourceAdapter;
  rawTags?: string[];
  urgency?: number;
  profitability?: number;
  competition?: number;
  ecosystemFit?: number;
  marketCeilingHint?: TrendSignal["marketCeilingHint"];
  notes?: string;
  externalId?: string;
  observedAt?: string;
}

export interface IngestResult {
  ok: true;
  signal: TrendSignal;
  scored: ScoredOpportunity;
  classification: ReturnType<typeof classifyWhoppertunity>;
  brief: PpiProductBrief | null;
  realtime: true;
  persisted: boolean;
}

function uid(prefix = "rt"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function mapAdapterToSource(adapter?: IngestSourceAdapter): SignalSource {
  switch (adapter) {
    case "rss":
      return "news";
    case "forum":
      return "forum";
    case "competitor":
      return "competitor";
    case "shopify_feedback":
      return "customer_feedback";
    case "zapier":
    case "webhook":
    case "generic":
      return "trend_export";
    default:
      return "manual";
  }
}

export function normalizeIngestBody(body: Record<string, unknown>): RealtimeIngestPayload | null {
  const title = String(body.title ?? body.name ?? body.headline ?? body.signal_title ?? "").trim();
  const summary = String(
    body.summary ?? body.description ?? body.body ?? body.text ?? body.content ?? "",
  ).trim();
  if (!title || !summary) return null;
  const tagsRaw = body.tags ?? body.rawTags ?? body.keywords;
  let rawTags: string[] = [];
  if (Array.isArray(tagsRaw)) rawTags = tagsRaw.map(String);
  else if (typeof tagsRaw === "string")
    rawTags = tagsRaw.split(/[,|]/).map((t) => t.trim()).filter(Boolean);
  const num = (v: unknown) =>
    v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  return {
    title: title.slice(0, 200),
    summary: summary.slice(0, 4000),
    source: (body.source as SignalSource) || undefined,
    adapter: (body.adapter as IngestSourceAdapter) || "webhook",
    rawTags,
    urgency: num(body.urgency),
    profitability: num(body.profitability ?? body.profit),
    competition: num(body.competition),
    ecosystemFit: num(body.ecosystemFit ?? body.fit),
    marketCeilingHint: body.marketCeilingHint as TrendSignal["marketCeilingHint"],
    notes: body.notes ? String(body.notes).slice(0, 1000) : undefined,
    externalId: body.externalId
      ? String(body.externalId)
      : body.id
        ? String(body.id)
        : undefined,
    observedAt: body.observedAt ? String(body.observedAt) : undefined,
  };
}

export async function persistSignal(
  env: Env,
  signal: TrendSignal,
  scored: ScoredOpportunity,
): Promise<boolean> {
  const kv = env.VISIBILITY_CACHE;
  if (!kv) return false;
  try {
    await kv.put(KV_SIGNAL(signal.id), JSON.stringify(signal));
    await kv.put(KV_SCORED(signal.id), JSON.stringify(scored));
    let recent: string[] = [];
    const raw = await kv.get(KV_RECENT);
    if (raw) {
      try {
        recent = JSON.parse(raw) as string[];
      } catch {
        recent = [];
      }
    }
    recent = [signal.id, ...recent.filter((id) => id !== signal.id)].slice(0, MAX_RECENT);
    await kv.put(KV_RECENT, JSON.stringify(recent));
    let index: string[] = [];
    const idxRaw = await kv.get(KV_INDEX);
    if (idxRaw) {
      try {
        index = JSON.parse(idxRaw) as string[];
      } catch {
        index = [];
      }
    }
    if (!index.includes(signal.id)) {
      index = [signal.id, ...index].slice(0, 500);
      await kv.put(KV_INDEX, JSON.stringify(index));
    }
    return true;
  } catch (e) {
    console.error("[ppi-ingest] persist failed", e);
    return false;
  }
}

export async function loadRecentScored(env: Env, limit = 20): Promise<ScoredOpportunity[]> {
  const kv = env.VISIBILITY_CACHE;
  if (!kv) return [];
  const raw = await kv.get(KV_RECENT);
  if (!raw) return [];
  let ids: string[] = [];
  try {
    ids = (JSON.parse(raw) as string[]).slice(0, limit);
  } catch {
    return [];
  }
  const out: ScoredOpportunity[] = [];
  for (const id of ids) {
    const s = await kv.get(KV_SCORED(id));
    if (s) {
      try {
        out.push(JSON.parse(s) as ScoredOpportunity);
      } catch {
        /* skip */
      }
    }
  }
  return out;
}

export async function ingestRealtime(
  env: Env,
  payload: RealtimeIngestPayload,
): Promise<IngestResult> {
  const signal: TrendSignal = {
    id: payload.externalId
      ? `ext_${payload.externalId}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64)
      : uid("rt"),
    title: payload.title,
    summary: payload.summary,
    source: payload.source || mapAdapterToSource(payload.adapter),
    rawTags: payload.rawTags ?? [],
    urgency: payload.urgency,
    profitability: payload.profitability,
    competition: payload.competition,
    ecosystemFit: payload.ecosystemFit,
    marketCeilingHint: payload.marketCeilingHint,
    observedAt: payload.observedAt ?? new Date().toISOString(),
    notes: payload.notes,
  };
  const pipeline = runPipeline(signal);
  const persisted = await persistSignal(env, pipeline.signal, pipeline.scored);
  return {
    ok: true,
    signal: pipeline.signal,
    scored: pipeline.scored,
    classification: pipeline.classification,
    brief: pipeline.brief,
    realtime: true,
    persisted,
  };
}

export async function ingestBatch(
  env: Env,
  items: RealtimeIngestPayload[],
): Promise<{ results: IngestResult[]; count: number }> {
  const results: IngestResult[] = [];
  for (const item of items.slice(0, 50)) {
    results.push(await ingestRealtime(env, item));
  }
  return { results, count: results.length };
}

export function verifyIngestSecret(
  env: Env & { PPI_INGEST_SECRET?: string },
  header: string | undefined,
  queryToken?: string | null,
): boolean {
  const secret = env.PPI_INGEST_SECRET || env.ADMIN_TOKEN;
  if (!secret) return true;
  const bearer = (header ?? "").replace(/^Bearer\s+/i, "").trim();
  const token = bearer || (queryToken ?? "");
  return token.length > 0 && token === secret;
}

export function ingestEndpointsDoc() {
  return {
    realtime: "POST /api/ppi/ingest",
    batch: "POST /api/ppi/ingest/batch",
    stream: "GET /api/ppi/ingest/stream",
    recent: "GET /api/ppi/ingest/recent",
    auth: "Authorization: Bearer <PPI_INGEST_SECRET|ADMIN_TOKEN> or ?token=",
    zapier: "Catch Hook → POST /api/ppi/ingest with title + summary",
    body: {
      title: "string required",
      summary: "string required",
      adapter: "webhook|zapier|rss|forum|competitor|...",
      urgency: "1-5 optional",
      profitability: "1-5 optional",
      competition: "1-5 optional",
      ecosystemFit: "1-5 optional",
      marketCeilingHint: "niche|million|hundred_million|billion_plus",
      externalId: "dedupe key optional",
    },
  };
}
