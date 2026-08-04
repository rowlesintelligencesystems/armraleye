/** Payments — Shop Pay · Stripe · PayPal */
export type PaymentProvider = "shop_pay" | "shopify_shop" | "stripe" | "paypal";

export interface PaymentLinkSpec {
  provider: PaymentProvider;
  productSku: string;
  title: string;
  amountUsd: number;
  currency: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export const ARMR_PE_PAYMENT_DEFAULTS: PaymentLinkSpec = {
  provider: "stripe",
  productSku: "ARMR-PE-COMPLETE",
  title: "ARMR Product Engine — Complete",
  amountUsd: 77,
  currency: "USD",
  successUrl: "https://www.armraleye.com/thank-you",
  cancelUrl: "https://www.armraleye.com/shop",
  metadata: { sku: "ARMR-PE-COMPLETE", brand: "ARMR_ALEYE", mark: "Hand_of_Hamsa" },
};

export interface ShopPayConfig {
  enabled: boolean;
  shopChannelEnabled: boolean;
  shopPayOnCheckout: boolean;
  notes: string;
}

export const SHOP_PAY_DEFAULT: ShopPayConfig = {
  enabled: true,
  shopChannelEnabled: true,
  shopPayOnCheckout: true,
  notes: "Enable Shop Pay via Shopify Payments; orders flow as Shopify orders.",
};

export function isShopPayOrder(payload: Record<string, unknown>): boolean {
  const source = String(payload.source_name ?? "").toLowerCase();
  const gateway = String(
    payload.payment_gateway_names
      ? JSON.stringify(payload.payment_gateway_names)
      : payload.gateway ?? "",
  ).toLowerCase();
  return (
    source.includes("shop") ||
    gateway.includes("shop pay") ||
    gateway.includes("shop_pay") ||
    gateway.includes("shopify_payments")
  );
}

export interface StripeConfig {
  mode: "payment_links" | "checkout_session" | "elements";
  secretEnvKey: "STRIPE_SECRET_KEY";
  webhookSecretEnvKey: "STRIPE_WEBHOOK_SECRET";
  defaultPriceUsd: number;
  productName: string;
  sku: string;
}

export const STRIPE_DEFAULT: StripeConfig = {
  mode: "payment_links",
  secretEnvKey: "STRIPE_SECRET_KEY",
  webhookSecretEnvKey: "STRIPE_WEBHOOK_SECRET",
  defaultPriceUsd: 77,
  productName: "ARMR Product Engine — Complete",
  sku: "ARMR-PE-COMPLETE",
};

export interface NormalizedPayment {
  provider: PaymentProvider;
  externalId: string;
  amount?: number;
  currency?: string;
  email?: string;
  status: "paid" | "pending" | "refunded" | "failed" | "cancelled";
  sku?: string;
  receivedAt: string;
  raw?: Record<string, unknown>;
}

export function normalizeStripeEvent(payload: Record<string, unknown>): NormalizedPayment {
  const type = String(payload.type ?? "");
  const data = (payload.data as Record<string, unknown>) || {};
  const obj = (data.object as Record<string, unknown>) || payload;
  let status: NormalizedPayment["status"] = "pending";
  if (
    type.includes("completed") ||
    type.includes("succeeded") ||
    String(obj.payment_status ?? obj.status ?? "") === "paid" ||
    String(obj.status ?? "") === "complete"
  ) {
    status = "paid";
  }
  if (type.includes("refund") || String(obj.status ?? "").includes("refund")) status = "refunded";
  if (type.includes("failed")) status = "failed";
  const amountTotal =
    obj.amount_total != null
      ? Number(obj.amount_total) / 100
      : obj.amount != null
        ? Number(obj.amount) / 100
        : undefined;
  const meta = (obj.metadata as Record<string, string>) || {};
  const customerDetails = (obj.customer_details as Record<string, unknown>) || {};
  return {
    provider: "stripe",
    externalId: String(obj.id ?? payload.id ?? "unknown"),
    amount: amountTotal,
    currency: obj.currency ? String(obj.currency).toUpperCase() : "USD",
    email:
      (obj.customer_email as string) ||
      (customerDetails.email as string) ||
      (obj.receipt_email as string) ||
      undefined,
    status,
    sku: meta.sku || STRIPE_DEFAULT.sku,
    receivedAt: new Date().toISOString(),
    raw: payload,
  };
}

export function stripePaymentLinkInstructions() {
  return {
    product: STRIPE_DEFAULT.productName,
    amount: `$${STRIPE_DEFAULT.defaultPriceUsd}`,
    steps: [
      "Stripe → Product: ARMR Product Engine — Complete · $77",
      "Metadata sku=ARMR-PE-COMPLETE",
      "Payment Link → success https://www.armraleye.com/thank-you",
      "Webhook POST /api/payments/stripe/webhook",
      "Events: checkout.session.completed, charge.refunded",
      "Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET",
    ],
  };
}

export interface PayPalConfig {
  mode: "payment_link" | "buttons" | "ipn";
  clientIdEnvKey: "PAYPAL_CLIENT_ID";
  secretEnvKey: "PAYPAL_CLIENT_SECRET";
  webhookIdEnvKey: "PAYPAL_WEBHOOK_ID";
  defaultPriceUsd: number;
  sku: string;
}

export const PAYPAL_DEFAULT: PayPalConfig = {
  mode: "payment_link",
  clientIdEnvKey: "PAYPAL_CLIENT_ID",
  secretEnvKey: "PAYPAL_CLIENT_SECRET",
  webhookIdEnvKey: "PAYPAL_WEBHOOK_ID",
  defaultPriceUsd: 77,
  sku: "ARMR-PE-COMPLETE",
};

export function normalizePayPalEvent(payload: Record<string, unknown>): NormalizedPayment {
  const eventType = String(payload.event_type ?? payload.txn_type ?? "");
  const resource = (payload.resource as Record<string, unknown>) || payload;
  let status: NormalizedPayment["status"] = "pending";
  if (
    eventType.includes("COMPLETED") ||
    eventType.includes("payment.capture.completed") ||
    String(resource.status ?? payload.payment_status ?? "") === "Completed"
  ) {
    status = "paid";
  }
  if (eventType.includes("REFUND") || eventType.includes("REVERSED")) status = "refunded";
  if (eventType.includes("DENIED") || eventType.includes("FAILED")) status = "failed";
  const amountObj =
    (resource.amount as Record<string, unknown>) ||
    (resource.seller_receivable_breakdown as Record<string, unknown>) ||
    {};
  const value =
    amountObj.value != null
      ? Number(amountObj.value)
      : payload.mc_gross != null
        ? Number(payload.mc_gross)
        : undefined;
  const payer = resource.payer as Record<string, unknown> | undefined;
  return {
    provider: "paypal",
    externalId: String(resource.id ?? payload.txn_id ?? payload.id ?? "unknown"),
    amount: value,
    currency: String(amountObj.currency_code ?? payload.mc_currency ?? "USD").toUpperCase(),
    email:
      String(payload.payer_email ?? payer?.email_address ?? "") || undefined,
    status,
    sku: PAYPAL_DEFAULT.sku,
    receivedAt: new Date().toISOString(),
    raw: payload,
  };
}

export function paypalPaymentLinkInstructions() {
  return {
    product: "ARMR Product Engine — Complete",
    amount: "$77",
    steps: [
      "PayPal → Payment Links · $77 · ARMR Product Engine",
      "Return URL thank-you page",
      "Webhook POST /api/payments/paypal/webhook",
      "Or Zapier → POST /api/channels/ingest/paypal",
    ],
  };
}

export function paymentsSummary() {
  return {
    providers: [
      { id: "shop_pay", name: "Shop Pay / Shop channel", via: "Shopify" },
      { id: "stripe", name: "Stripe", mode: STRIPE_DEFAULT.mode },
      { id: "paypal", name: "PayPal", mode: PAYPAL_DEFAULT.mode },
    ],
    product: { sku: "ARMR-PE-COMPLETE", title: "ARMR Product Engine — Complete", priceUsd: 77 },
    endpoints: {
      stripeWebhook: "/api/payments/stripe/webhook",
      paypalWebhook: "/api/payments/paypal/webhook",
      stripeIngest: "/api/channels/ingest/stripe",
      paypalIngest: "/api/channels/ingest/paypal",
    },
    generatedAt: new Date().toISOString(),
  };
}
