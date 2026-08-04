/** PPI labels ↔ commercial ebook "Whoppertunity vs Flopportunity" SKU ARMR-DIG-WVF-001 */
export const WVF_EBOOK = {
  sku: "ARMR-DIG-WVF-001",
  title: "Whoppertunity vs Flopportunity — Identify Real Opportunities",
  subtitle: "How ARMR ALEYE spots real opportunities — and flopportunities",
  priceUsd: 27,
  type: "ebook" as const,
  formats: ["pdf", "epub"],
  packagingMark: "Hand of Hamsa\u2122",
  claims: "Educational only. Not financial, legal, or medical advice.",
};

export const CLASS_TO_EBOOK_LANGUAGE: Record<string, string> = {
  whoppertunity: "Whoppertunity — prioritize build and placement",
  flopportunity: "Flopportunity — do not build; walk away",
  watch: "Watch zone — track, don\u2019t commit yet",
  pivot: "Pivot zone — strong profit signal, weak fit",
  expansion: "Expansion — solid opportunity adjacent to core",
};
