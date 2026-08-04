/** Multi-channel sales routes — /api/channels */
import { Hono } from "hono";
import type { Env } from "../lib/types";
import {
  ARMR_PRODUCT_ENGINE_MASTER,
  CHANNELS,
  channelsSummary,
  fanoutAll,
  mapListingToChannel,
  normalizeSale,
  type ChannelId,
} from "../lib/systems/channels";
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

const channels = new Hono<{ Bindings: Env }>();

channels.get("/", (c) => c.json(channelsSummary()));

channels.get("/fanout", (c) => {
  const listings = fanoutAll(ARMR_PRODUCT_ENGINE_MASTER);
  return c.json({ master: ARMR_PRODUCT_ENGINE_MASTER, listings, count: listings.length });
});

channels.get("/fanout/:channel", (c) => {
  const id = c.req.param("channel") as ChannelId;
  if (!CHANNELS.some((x) => x.id === id)) return c.json({ error: "Unknown channel" }, 404);
  return c.json(mapListingToChannel(ARMR_PRODUCT_ENGINE_MASTER, id));
});

channels.post("/ingest/:channel", async (c) => {
  const id = c.req.param("channel") as ChannelId;
  if (!CHANNELS.some((x) => x.id === id)) return c.json({ error: "Unknown channel" }, 404);
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
  const event = normalizeSale(id, body);
  const hook = (c.env as { CHANNELS_ZAPIER_HOOK?: string }).CHANNELS_ZAPIER_HOOK;
  if (hook) {
    await dispatchWebhook(hook, `channel.sale.${id}`, event as unknown as Record<string, unknown>, {
      source: "channels-ingest",
    });
  }
  return c.json({ ok: true, event }, 201);
});

channels.get("/checklist", (c) =>
  c.json({
    title: "Multi-channel publish checklist — ARMR Product Engine",
    sku: ARMR_PRODUCT_ENGINE_MASTER.sku,
    steps: [
      { channel: "shopify", action: "Primary digital product $77 + ZIP" },
      { channel: "gumroad", action: "Upload ZIP · paste /fanout/gumroad" },
      { channel: "etsy", action: "Digital listing · /fanout/etsy" },
      { channel: "fiverr", action: "Gig packages · /fanout/fiverr" },
      { channel: "ebay", action: "Digital listing · /fanout/ebay" },
      { channel: "zapier", action: "Sale → POST /api/channels/ingest/:channel" },
    ],
    guardrails: [
      "No disease claims",
      "Hand of Hamsa\u2122 packaging mark only",
      "ARMR Product Engine = product name",
    ],
  }),
);

channels.post("/admin/ping", (c) => {
  if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ ok: true, channels: CHANNELS.length });
});

export default channels;
