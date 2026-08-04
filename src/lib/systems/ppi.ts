/**
 * ENG-PPI — Profit Positioning Intelligence
 * Trends → score → Whoppertunity → placement → Product Engine + channels
 */
export type SignalSource =
  | "forum"
  | "trend_export"
  | "competitor"
  | "customer_feedback"
  | "product_performance"
  | "manual"
  | "news"
  | "search";

export interface TrendSignal {
  id: string;
  title: string;
  summary: string;
  source: SignalSource;
  rawTags: string[];
  urgency?: number;
  profitability?: number;
  competition?: number;
  ecosystemFit?: number;
  marketCeilingHint?: "niche" | "million" | "hundred_million" | "billion_plus";
  observedAt: string;
  notes?: string;
}

export type OpportunityClass =
  | "whoppertunity"
  | "watch"
  | "flopportunity"
  | "pivot"
  | "expansion";

export interface PlacementWindow {
  status: "now" | "soon" | "hold" | "skip";
  earliest?: string;
  latest?: string;
  reason: string;
}

export interface ScoredOpportunity {
  signalId: string;
  title: string;
  score: number;
  class: OpportunityClass;
  dimensions: {
    urgency: number;
    profitability: number;
    competition: number;
    ecosystemFit: number;
    marketPotential: number;
  };
  rationale: string[];
  productHints: string[];
  placement: PlacementWindow;
  doctrineAligned: boolean;
}

export interface PpiProductBrief {
  opportunityId: string;
  suggestedSku: string;
  suggestedTitle: string;
  priceBandUsd: number;
  morphFrom?: string;
  channelPriority: string[];
  placement: PlacementWindow;
}

const uid = () => `ppi_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

function clamp15(n: number | undefined, d = 3): number {
  const v = n == null || Number.isNaN(n) ? d : n;
  return Math.max(1, Math.min(5, Math.round(v)));
}

function marketPotentialScore(hint?: TrendSignal["marketCeilingHint"]): number {
  switch (hint) {
    case "billion_plus":
      return 5;
    case "hundred_million":
      return 4;
    case "million":
      return 3;
    case "niche":
      return 2;
    default:
      return 3;
  }
}

export function scoreSignal(signal: TrendSignal): ScoredOpportunity {
  const urgency = clamp15(signal.urgency);
  const profitability = clamp15(signal.profitability);
  const competition = clamp15(signal.competition);
  const ecosystemFit = clamp15(signal.ecosystemFit);
  const marketPotential = marketPotentialScore(signal.marketCeilingHint);
  const competitionEase = 6 - competition;
  const weighted =
    profitability * 0.28 +
    ecosystemFit * 0.22 +
    marketPotential * 0.2 +
    urgency * 0.15 +
    competitionEase * 0.15;
  const score = Math.round((weighted / 5) * 100);
  const rationale: string[] = [
    `urgency=${urgency}/5 profitability=${profitability}/5`,
    `competition=${competition}/5 (ease=${competitionEase}) fit=${ecosystemFit}/5`,
    `marketPotential=${marketPotential}/5 → score=${score}`,
  ];
  const text = `${signal.title} ${signal.summary}`.toLowerCase();
  const doctrineAligned = !/(cure cancer|heal leukemia|disease cure|guaranteed income)/i.test(text);
  if (!doctrineAligned) rationale.push("BLOCK: claim language — flopportunity");

  let oppClass: OpportunityClass;
  if (!doctrineAligned) oppClass = "flopportunity";
  else if (score >= 75 && marketPotential >= 4) oppClass = "whoppertunity";
  else if (score >= 60) oppClass = "expansion";
  else if (score >= 45) oppClass = "watch";
  else if (score < 35 && competition >= 4) oppClass = "flopportunity";
  else if (ecosystemFit <= 2 && profitability >= 4) oppClass = "pivot";
  else oppClass = "watch";

  const placement = computePlacementWindow(score, oppClass, urgency, marketPotential);
  const productHints: string[] = [];
  if (oppClass === "whoppertunity" || oppClass === "expansion") {
    productHints.push("ARMR Product Engine morph", "Digital guide + checklist + listing pack");
    if (marketPotential >= 4) productHints.push("Bundle ladder + multi-channel fanout");
  }
  if (oppClass === "watch") productHints.push("Signal tracker only");
  if (oppClass === "flopportunity") productHints.push("Do not build");

  return {
    signalId: signal.id,
    title: signal.title,
    score,
    class: oppClass,
    dimensions: { urgency, profitability, competition, ecosystemFit, marketPotential },
    rationale,
    productHints,
    placement,
    doctrineAligned,
  };
}

export function computePlacementWindow(
  score: number,
  oppClass: OpportunityClass,
  urgency: number,
  marketPotential: number,
): PlacementWindow {
  const now = new Date();
  if (oppClass === "flopportunity") return { status: "skip", reason: "Flopportunity — do not place" };
  if (!score || score < 45) return { status: "hold", reason: "Score below build threshold" };
  if (oppClass === "whoppertunity" && urgency >= 4) {
    return {
      status: "now",
      earliest: now.toISOString().slice(0, 10),
      reason: "High score + urgency — place via Product Engine + channels",
    };
  }
  if (oppClass === "whoppertunity" || (score >= 70 && marketPotential >= 4)) {
    const soon = new Date(now.getTime() + 7 * 86400000);
    return {
      status: "soon",
      earliest: now.toISOString().slice(0, 10),
      latest: soon.toISOString().slice(0, 10),
      reason: "Whoppertunity / large-market — place within 7 days",
    };
  }
  if (oppClass === "expansion" || oppClass === "watch") {
    const hold = new Date(now.getTime() + 30 * 86400000);
    return {
      status: "hold",
      earliest: hold.toISOString().slice(0, 10),
      reason: "Watch/expansion — after capacity free",
    };
  }
  return { status: "hold", reason: "Default hold for review" };
}

export function classifyWhoppertunity(scored: ScoredOpportunity) {
  return {
    isWhoppertunity: scored.class === "whoppertunity",
    class: scored.class,
    label:
      scored.class === "whoppertunity"
        ? "WHOPPERTUNITY — prioritize build + placement"
        : scored.class.toUpperCase(),
  };
}

export function toProductBrief(scored: ScoredOpportunity): PpiProductBrief | null {
  if (scored.class === "flopportunity" || scored.placement.status === "skip") return null;
  if (scored.score < 45) return null;
  const slug = scored.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const priceBand =
    scored.dimensions.marketPotential >= 4 && scored.score >= 70
      ? 97
      : scored.score >= 60
        ? 77
        : 47;
  const channelPriority =
    scored.placement.status === "now" || scored.placement.status === "soon"
      ? ["shopify", "gumroad", "etsy", "fiverr", "stripe_payment_link"]
      : ["shopify"];
  return {
    opportunityId: scored.signalId,
    suggestedSku: `ARMR-PPI-${slug.slice(0, 12).toUpperCase() || "OPP"}`,
    suggestedTitle: `ARMR ${scored.title}`.slice(0, 120),
    priceBandUsd: priceBand,
    morphFrom: "ARMR Product Engine",
    channelPriority,
    placement: scored.placement,
  };
}

const signalStore = new Map<string, TrendSignal>();
const scoredStore = new Map<string, ScoredOpportunity>();

export function ingestSignal(
  input: Omit<TrendSignal, "id" | "observedAt"> & { id?: string; observedAt?: string },
): TrendSignal {
  const signal: TrendSignal = {
    id: input.id ?? uid(),
    title: input.title,
    summary: input.summary,
    source: input.source,
    rawTags: input.rawTags ?? [],
    urgency: input.urgency,
    profitability: input.profitability,
    competition: input.competition,
    ecosystemFit: input.ecosystemFit,
    marketCeilingHint: input.marketCeilingHint,
    observedAt: input.observedAt ?? new Date().toISOString(),
    notes: input.notes,
  };
  signalStore.set(signal.id, signal);
  scoredStore.set(signal.id, scoreSignal(signal));
  return signal;
}

export function getScored(id: string) {
  return scoredStore.get(id);
}
export function listScored() {
  return [...scoredStore.values()].sort((a, b) => b.score - a.score);
}
export function listSignals() {
  return [...signalStore.values()];
}

export function runPipeline(signal: TrendSignal) {
  signalStore.set(signal.id, signal);
  const scored = scoreSignal(signal);
  scoredStore.set(signal.id, scored);
  return {
    signal,
    scored,
    classification: classifyWhoppertunity(scored),
    brief: toProductBrief(scored),
  };
}

export function ppiHealth() {
  return {
    engine: "ENG-PPI",
    name: "Profit Positioning Intelligence",
    signals: signalStore.size,
    scored: scoredStore.size,
    status: "active",
    hooks: ["ARMR Product Engine", "channels fanout", "placement window"],
  };
}
