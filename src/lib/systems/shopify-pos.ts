/**
 * Shopify POS Integration — ARMR ALEYE
 */
export type PosLocation = { id: string; name: string; active: boolean };

export interface ShopifyPosConfig {
  enabled: boolean;
  locations: PosLocation[];
  digitalFulfillment: "email" | "qr" | "manual";
  physicalSkus: string[];
  webhookTopics: string[];
}

export const SHOPIFY_POS_DEFAULT: ShopifyPosConfig = {
  enabled: true,
  locations: [{ id: "primary", name: "Primary / Mobile POS", active: true }],
  digitalFulfillment: "email",
  physicalSkus: ["ARMR-PHY-NFC-RING", "ARMR-PHY-PIN"],
  webhookTopics: [
    "orders/create",
    "orders/paid",
    "orders/fulfilled",
    "orders/cancelled",
    "refunds/create",
    "inventory_levels/update",
  ],
};

export function isPosOrder(payload: Record<string, unknown>): boolean {
  const sourceName = String(payload.source_name ?? payload.sourceName ?? "").toLowerCase();
  if (
    sourceName === "pos" ||
    sourceName === "shopify_pos" ||
    sourceName === "point_of_sale" ||
    sourceName.includes("pos")
  ) {
    return true;
  }
  const client = payload.client_details as Record<string, unknown> | undefined;
  if (client && String(client.user_agent ?? "").toLowerCase().includes("pos")) {
    return true;
  }
  return false;
}

export interface NormalizedPosSale {
  channel: "shopify_pos";
  externalId: string;
  orderNumber?: string;
  email?: string;
  phone?: string;
  amount?: number;
  currency?: string;
  status: "paid" | "pending" | "refunded" | "cancelled";
  lineItems: { sku?: string; title?: string; quantity: number; price?: number }[];
  locationId?: string;
  digitalSkus: string[];
  physicalSkus: string[];
  receivedAt: string;
  raw?: Record<string, unknown>;
}

const DIGITAL_SKU_PREFIXES = ["ARMR-PE", "ARMR-BME", "ARMR-DIG", "ARMR-BND"];

function isDigitalSku(sku: string): boolean {
  const s = sku.toUpperCase();
  return DIGITAL_SKU_PREFIXES.some((p) => s.startsWith(p)) || s.includes("DIGITAL");
}

export function normalizePosOrder(payload: Record<string, unknown>): NormalizedPosSale {
  const lineItemsRaw = (payload.line_items as unknown[]) || [];
  const lineItems = lineItemsRaw.map((li) => {
    const item = (li || {}) as Record<string, unknown>;
    return {
      sku: item.sku ? String(item.sku) : undefined,
      title: item.title ? String(item.title) : undefined,
      quantity: Number(item.quantity ?? 1),
      price: item.price != null ? Number(item.price) : undefined,
    };
  });

  const digitalSkus = lineItems
    .filter((l) => l.sku && isDigitalSku(l.sku))
    .map((l) => l.sku as string);
  const physicalSkus = lineItems
    .filter((l) => l.sku && !isDigitalSku(l.sku))
    .map((l) => l.sku as string);

  const financial = String(payload.financial_status ?? "paid").toLowerCase();
  let status: NormalizedPosSale["status"] = "paid";
  if (financial === "pending" || financial === "authorized") status = "pending";
  if (financial === "refunded" || financial === "voided") status = "refunded";
  if (String(payload.cancelled_at ?? "") !== "") status = "cancelled";

  return {
    channel: "shopify_pos",
    externalId: String(payload.id ?? payload.order_id ?? "unknown"),
    orderNumber: payload.order_number != null ? String(payload.order_number) : undefined,
    email: payload.email
      ? String(payload.email)
      : payload.contact_email
        ? String(payload.contact_email)
        : undefined,
    phone: payload.phone ? String(payload.phone) : undefined,
    amount: payload.total_price != null ? Number(payload.total_price) : undefined,
    currency: payload.currency ? String(payload.currency) : "USD",
    status,
    lineItems,
    locationId: payload.location_id != null ? String(payload.location_id) : undefined,
    digitalSkus,
    physicalSkus,
    receivedAt: new Date().toISOString(),
    raw: payload,
  };
}

export interface PosFulfillmentAction {
  type: "send_digital_email" | "pick_physical" | "notify_crm" | "noop";
  detail: string;
}

export function planPosFulfillment(sale: NormalizedPosSale): PosFulfillmentAction[] {
  const actions: PosFulfillmentAction[] = [];
  if (sale.status !== "paid") {
    actions.push({ type: "noop", detail: `Status ${sale.status} — no fulfill` });
    return actions;
  }
  if (sale.digitalSkus.length) {
    actions.push({
      type: "send_digital_email",
      detail: `Email download links for: ${sale.digitalSkus.join(", ")}`,
    });
  }
  if (sale.physicalSkus.length) {
    actions.push({
      type: "pick_physical",
      detail: `Hand over inventory: ${sale.physicalSkus.join(", ")}`,
    });
  }
  actions.push({ type: "notify_crm", detail: "Create/update contact + deal from POS sale" });
  return actions;
}

export function shopifyPosSetupChecklist() {
  return {
    title: "Shopify POS setup — ARMR ALEYE",
    product: "ARMR Product Engine + physical roadmap",
    steps: [
      { step: 1, action: "Sales channels → Point of Sale → enable" },
      { step: 2, action: "Install Shopify POS app; staff login" },
      { step: 3, action: "Locations — Mobile / Event if needed" },
      { step: 4, action: "Publish ARMR Product Engine to POS channel" },
      { step: 5, action: "Require customer email for digital line items" },
      { step: 6, action: "Keep digital download email templates on" },
      {
        step: 7,
        action:
          "Webhook orders/paid → POST /api/channels/ingest/shopify_pos (or /ingest/shopify)",
      },
      { step: 8, action: "Test POS digital sale end-to-end" },
      { step: 9, action: "Optional Smart Grid tile for Product Engine" },
      { step: 10, action: "Physical NFC ring inventory when supplier ready" },
    ],
    guardrails: [
      "Collect email on POS for digital SKUs",
      "No disease claims",
      "Hand of Hamsa\u2122 packaging mark on physical only",
      "ARMR Product Engine = product name",
    ],
  };
}
