/** Payment routes — /api/payments */
import { Hono } from "hono";
import type { Env } from "../lib/types";
import {
  normalizePayPalEvent,
  normalizeStripeEvent,
  paymentsSummary,
  paypalPaymentLinkInstructions,
  SHOP_PAY_DEFAULT,
  stripePaymentLinkInstructions,
} from "../lib/systems/payments";
import { dispatchWebhook } from "../lib/webhook-dispatch";

const payments = new Hono<{ Bindings: Env }>();

payments.get("/", (c) => c.json(paymentsSummary()));
payments.get("/stripe/instructions", (c) => c.json(stripePaymentLinkInstructions()));
payments.get("/paypal/instructions", (c) => c.json(paypalPaymentLinkInstructions()));
payments.get("/shop-pay/config", (c) => c.json(SHOP_PAY_DEFAULT));

payments.post("/stripe/webhook", async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
  const event = normalizeStripeEvent(body);
  const hook = (c.env as { CHANNELS_ZAPIER_HOOK?: string }).CHANNELS_ZAPIER_HOOK;
  if (hook && event.status === "paid") {
    await dispatchWebhook(hook, "payment.stripe.paid", event as unknown as Record<string, unknown>, {
      source: "stripe-webhook",
    });
  }
  return c.json({ ok: true, event }, 200);
});

payments.post("/paypal/webhook", async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));
  const event = normalizePayPalEvent(body);
  const hook = (c.env as { CHANNELS_ZAPIER_HOOK?: string }).CHANNELS_ZAPIER_HOOK;
  if (hook && event.status === "paid") {
    await dispatchWebhook(hook, "payment.paypal.paid", event as unknown as Record<string, unknown>, {
      source: "paypal-webhook",
    });
  }
  return c.json({ ok: true, event }, 200);
});

payments.get("/checklist", (c) =>
  c.json({
    title: "Shop Pay · Stripe · PayPal",
    product: "ARMR Product Engine $77",
    steps: [
      {
        id: "shop_pay",
        actions: [
          "Shopify Payments → enable Shop Pay",
          "Optional Shop sales channel",
          "Orders → /api/channels/ingest/shopify",
        ],
      },
      { id: "stripe", actions: stripePaymentLinkInstructions().steps },
      { id: "paypal", actions: paypalPaymentLinkInstructions().steps },
    ],
    guardrails: [
      "ARMR Product Engine name",
      "Hand of Hamsa packaging mark only",
      "No disease claims",
    ],
  }),
);

export default payments;
