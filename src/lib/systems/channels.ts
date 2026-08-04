/**
 * ENG-MSE — Multi-Channel Sales & Marketing Integration
 * Shopify, Gumroad, Fiverr, eBay, Etsy, Amazon, PayPal, Stripe, generic
 */
export type ChannelId =
  | "shopify"
  | "gumroad"
  | "fiverr"
  | "ebay"
  | "etsy"
  | "amazon"
  | "paypal"
  | "stripe_payment_link"
  | "generic";

export type ChannelCategory = "storefront" | "freelance" | "marketplace" | "payments";

export interface ChannelDefinition {
  id: ChannelId;
  name: string;
  category: ChannelCategory;
  status: "active" | "export_ready" | "zapier" | "planned";
  listingNotes: string;
  webhookEvents: string[];
  maxTitle?: number;
  digitalOk: boolean;
  physicalOk: boolean;
}

export const CHANNELS: ChannelDefinition[] = [
  {
    id: "shopify",
    name: "Shopify",
    category: "storefront",
    status: "active",
    listingNotes: "Primary store · ARMR Product Engine digital download",
    webhookEvents: ["orders/paid", "orders/fulfilled"],
    maxTitle: 255,
    digitalOk: true,
    physicalOk: true,
  },
  {
    id: "gumroad",
    name: "Gumroad",
    category: "storefront",
    status: "export_ready",
    listingNotes: "Digital-first · ZIP upload",
    webhookEvents: ["sale", "refund"],
    maxTitle: 120,
    digitalOk: true,
    physicalOk: false,
  },
  {
    id: "fiverr",
    name: "Fiverr",
    category: "freelance",
    status: "export_ready",
    listingNotes: "Gig packages · service delivery",
    webhookEvents: ["order_created", "order_completed"],
    maxTitle: 80,
    digitalOk: true,
    physicalOk: false,
  },
  {
    id: "ebay",
    name: "eBay",
    category: "marketplace",
    status: "zapier",
    listingNotes: "Listing + digital delivery message",
    webhookEvents: ["ORDER.PAID"],
    maxTitle: 80,
    digitalOk: true,
    physicalOk: true,
  },
  {
    id: "etsy",
    name: "Etsy",
    category: "marketplace",
    status: "export_ready",
    listingNotes: "Digital downloads + tags",
    webhookEvents: ["receipt", "refund"],
    maxTitle: 140,
    digitalOk: true,
    physicalOk: true,
  },
  {
    id: "amazon",
    name: "Amazon",
    category: "marketplace",
    status: "planned",
    listingNotes: "Later compliance",
    webhookEvents: ["ORDER_CHANGE"],
    maxTitle: 200,
    digitalOk: true,
    physicalOk: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "payments",
    status: "zapier",
    listingNotes: "Payment links via Zapier",
    webhookEvents: ["PAYMENT.SALE.COMPLETED"],
    digitalOk: true,
    physicalOk: true,
  },
  {
    id: "stripe_payment_link",
    name: "Stripe Payment Link",
    category: "payments",
    status: "zapier",
    listingNotes: "Direct pay links",
    webhookEvents: ["checkout.session.completed"],
    digitalOk: true,
    physicalOk: true,
  },
  {
    id: "generic",
    name: "Generic / Other",
    category: "storefront",
    status: "zapier",
    listingNotes: "Any Zapier-capable platform",
    webhookEvents: ["purchase"],
    digitalOk: true,
    physicalOk: true,
  },
];

export interface MasterListing {
  sku: string;
  title: string;
  subtitle?: string;
  description: string;
  priceUsd: number;
  currency?: string;
  tags: string[];
  digitalFileName?: string;
  packagingMark?: string;
  cta?: string;
}

export const ARMR_PRODUCT_ENGINE_MASTER: MasterListing = {
  sku: "ARMR-PE-COMPLETE",
  title: "ARMR Product Engine — Turn Frameworks into Action-Ready Products",
  subtitle: "Complete Package",
  description:
    "ARMR Product Engine is the execution layer. Turn a framework you already understand into action-ready tools: guide, checklist, listing template, vault skeleton, and pricing sheet. Packaging mark: Hand of Hamsa\u2122. Not medical advice.",
  priceUsd: 77,
  currency: "USD",
  tags: [
    "digital download",
    "product templates",
    "framework",
    "checklist",
    "ARMR ALEYE",
    "Hand of Hamsa",
  ],
  digitalFileName: "ARMR_Product_Engine_Complete_v1.0.zip",
  packagingMark: "Hand of Hamsa\u2122",
  cta: "Get ARMR Product Engine",
};

export interface ChannelListing {
  channel: ChannelId;
  title: string;
  description: string;
  price: number;
  tags: string[];
  extras?: Record<string, string>;
}

function trunc(s: string, n?: number): string {
  if (!n || s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "\u2026";
}

export function mapListingToChannel(
  master: MasterListing,
  channelId: ChannelId,
): ChannelListing {
  const ch = CHANNELS.find((c) => c.id === channelId) ?? CHANNELS.find((c) => c.id === "generic")!;
  const title = trunc(master.title, ch.maxTitle);

  switch (channelId) {
    case "gumroad":
      return {
        channel: "gumroad",
        title: trunc("ARMR Product Engine \u2014 Complete", 120),
        description:
          master.description +
          "\n\nInstant download after purchase.\nPackaging mark: Hand of Hamsa\u2122\nARMR ALEYE",
        price: master.priceUsd,
        tags: master.tags.slice(0, 5),
        extras: {
          product_type: "digital",
          file: master.digitalFileName ?? "",
          url_slug: "armr-product-engine",
        },
      };
    case "fiverr":
      return {
        channel: "fiverr",
        title: trunc("I will deliver ARMR Product Engine product kit", 80),
        description:
          "Gig: deliver ARMR Product Engine complete digital package (guide, checklist, listing template, vault, pricing).\nPackages: Basic = Core \u00b7 Standard = Complete \u00b7 Premium = Complete + niche outline.\nNot medical advice. Hand of Hamsa\u2122 packaging mark.",
        price: master.priceUsd,
        tags: ["business", "templates", "productized service"],
        extras: { delivery_days: "1" },
      };
    case "ebay":
      return {
        channel: "ebay",
        title: trunc("ARMR Product Engine Digital Download Guide Checklist", 80),
        description:
          master.description +
          "\n\nDigital delivery after payment. No physical item unless stated.",
        price: master.priceUsd,
        tags: master.tags,
        extras: { format: "Digital download", condition: "New" },
      };
    case "etsy":
      return {
        channel: "etsy",
        title: trunc("ARMR Product Engine Digital Product Kit Hand of Hamsa", 140),
        description:
          master.description +
          "\n\nDigital download via Etsy after purchase. Hand of Hamsa\u2122 packaging mark.",
        price: master.priceUsd,
        tags: [
          "digital download",
          "business template",
          "product planner",
          "checklist",
          "instant download",
          "framework tools",
          "ARMR",
          "Hamsa",
          "entrepreneur",
          "small business",
          "product launch",
          "guide",
          "printable business",
        ].slice(0, 13),
        extras: {
          who_made: "I did",
          what_is_it: "A digital download",
        },
      };
    case "shopify":
      return {
        channel: "shopify",
        title: master.title,
        description: master.description,
        price: master.priceUsd,
        tags: master.tags,
        extras: {
          sku: master.sku,
          handle: "armr-product-engine",
          cta: master.cta ?? "",
        },
      };
    default:
      return {
        channel: channelId,
        title,
        description: master.description,
        price: master.priceUsd,
        tags: master.tags,
        extras: { sku: master.sku },
      };
  }
}

export function fanoutAll(
  master: MasterListing = ARMR_PRODUCT_ENGINE_MASTER,
): ChannelListing[] {
  return CHANNELS.filter((c) => c.id !== "generic").map((c) =>
    mapListingToChannel(master, c.id),
  );
}

export interface ChannelSaleEvent {
  channel: ChannelId;
  externalId: string;
  sku?: string;
  amount?: number;
  currency?: string;
  email?: string;
  status: "paid" | "refunded" | "pending" | "cancelled";
  raw?: Record<string, unknown>;
  receivedAt: string;
}

export function normalizeSale(
  channel: ChannelId,
  payload: Record<string, unknown>,
): ChannelSaleEvent {
  const receivedAt = new Date().toISOString();
  switch (channel) {
    case "gumroad":
      return {
        channel,
        externalId: String(payload.sale_id ?? payload.id ?? "unknown"),
        email: payload.email ? String(payload.email) : undefined,
        amount: payload.price != null ? Number(payload.price) / 100 : undefined,
        status: "paid",
        sku: String(payload.sku ?? ARMR_PRODUCT_ENGINE_MASTER.sku),
        raw: payload,
        receivedAt,
      };
    case "etsy":
      return {
        channel,
        externalId: String(payload.receipt_id ?? payload.order_id ?? "unknown"),
        amount: payload.grandtotal != null ? Number(payload.grandtotal) : undefined,
        status: "paid",
        raw: payload,
        receivedAt,
      };
    case "ebay":
      return {
        channel,
        externalId: String(payload.orderId ?? payload.OrderID ?? "unknown"),
        status: "paid",
        raw: payload,
        receivedAt,
      };
    case "fiverr":
      return {
        channel,
        externalId: String(payload.order_id ?? payload.id ?? "unknown"),
        status: "paid",
        raw: payload,
        receivedAt,
      };
    default:
      return {
        channel,
        externalId: String(payload.id ?? payload.order_id ?? `evt_${Date.now()}`),
        amount: payload.amount != null ? Number(payload.amount) : undefined,
        email: payload.email ? String(payload.email) : undefined,
        status: (payload.status as ChannelSaleEvent["status"]) || "paid",
        sku: payload.sku ? String(payload.sku) : undefined,
        raw: payload,
        receivedAt,
      };
  }
}

export function channelsSummary() {
  return {
    total: CHANNELS.length,
    byStatus: CHANNELS.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    channels: CHANNELS,
    masterSku: ARMR_PRODUCT_ENGINE_MASTER.sku,
    generatedAt: new Date().toISOString(),
  };
}
