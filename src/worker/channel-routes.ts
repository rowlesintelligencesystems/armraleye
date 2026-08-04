/** Multi-channel + Shopify POS routes — /api/channels */
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
import {
  isPosOrder,
  normalizePosOrder,
  planPosFulfillment,
  shopifyPosSetupChecklist,
  SHOPIFY_POS_DEFAULT,
} from "../lib/systems/shopify-pos";
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

channels.get("/", (c) =>
  c.json({
    ...channelsSummary(),
    shopifyPos: { enabled: SHOPIFY_POS_DEFAULT.enabled, config: SHOPIFY_POS_DEFAULT },
  }),
);

channels.get("/fanout", (c) => {
  const listings = fanoutAll(ARMR_PRODUCT_ENGINE_MASTER);
  return c.json({ master: ARMR_PRODUCT_ENGINE_MASTER, listings, count: listings.length });
});

channels.get("/fanout/:channel", (c) => {
  const id = c.req.param("channel") as ChannelId;
  if (!CHANNELS.some((x) => x.id === id)) return c.json({ error: "Unknown channel" }, 404);
  return c.json(mapListingToChannel(ARMR_PRODUCT_ENGINE_MASTER, id));
});

channels.get("/pos/checklist", (c) => c.json(shopifyPosSetupChecklist()));
channels.get("/pos/config", (c) => c.json(SHOPIFY_POS_DEFAULT));

channels.post("/ingest/shopify", async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
  if (isPosOrder(body)) {
    const sale = normalizePosOrder(body);
    const actions = planPosFulfillment(sale);
    const hook = (c.env as { CHANNELS_ZAPIER_HOOK?: string }).CHANNELS_ZAPIER_HOOK;
    if (hook) {
      await dispatchWebhook(
        hook,
        "channel.sale.shopify_pos",
        { sale, actions } as unknown as Record<string, unknown>,
        { source: "shopify-pos" },
      );
    }
    return c.json({ ok: true, source: "pos", sale, actions }, 201);
  }
  const event = normalizeSale("shopify", body);
  return c.json({ ok: true, source: "online", event }, 201);
});

channels.post("/ingest/shopify_pos", async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
  const sale = normalizePosOrder(body);
  const actions = planPosFulfillment(sale);
  const hook = (c.env as { CHANNELS_ZAPIER_HOOK?: string }).CHANNELS_ZAPIER_HOOK;
  if (hook) {
    await dispatchWebhook(
      hook,
      "channel.sale.shopify_pos",
      { sale, actions } as unknown as Record<string, unknown>,
      { source: "shopify-pos" },
    );
  }
  return c.json({ ok: true, sale, actions }, 201);
});

channels.post("/ingest/:channel", async (c) => {
  const id = c.req.param("channel") as ChannelId | "shopify_pos";
  if (id === "shopify_pos") {
    const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
    const sale = normalizePosOrder(body);
    const actions = planPosFulfillment(sale);
    return c.json({ ok: true, sale, actions }, 201);
  }
  if (!CHANNELS.some((x) => x.id === id)) return c.json({ error: "Unknown channel" }, 404);
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
  const event = normalizeSale(id as ChannelId, body);
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
    title: "Multi-channel + POS checklist",
    sku: ARMR_PRODUCT_ENGINE_MASTER.sku,
    steps: [
      { channel: "shopify", action: "Primary digital $77 + ZIP" },
      { channel: "shopify_pos", action: "Enable POS · publish product · webhook" },
      { channel: "gumroad", action: "/fanout/gumroad" },
      { channel: "etsy", action: "/fanout/etsy" },
      { channel: "fiverr", action: "/fanout/fiverr" },
      { channel: "ebay", action: "/fanout/ebay" },
    ],
    guardrails: [
      "POS digital requires email",
      "No disease claims",
      "Hand of Hamsa\u2122 packaging mark only",
      "ARMR Product Engine = product name",
    ],
  }),
);

channels.post("/admin/ping", (c) => {
  if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ ok: true, channels: CHANNELS.length, pos: true });
});

export default channels;
