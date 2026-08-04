/**
 * ENG-WCT / Page Builder — ARMR Website Creation Tool
 * Block-based pages · templates · HTML render · Shopify export hooks
 * Pattern: PAT-021
 */
export type BlockType =
  | "hero"
  | "text"
  | "cta"
  | "trinity"
  | "product"
  | "image"
  | "features"
  | "faq"
  | "divider"
  | "html";

export interface PageBlock {
  id: string;
  type: BlockType;
  props: Record<string, string | string[] | boolean>;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  blocks: PageBlock[];
  updatedAt: string;
  brand?: "armr-aleye";
}

export interface SiteProject {
  id: string;
  name: string;
  domain?: string;
  theme: "void-dark";
  pages: SitePage[];
  createdAt: string;
}

const uid = () => `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const BLOCK_CATALOG: {
  type: BlockType;
  label: string;
  defaults: Record<string, string | string[] | boolean>;
}[] = [
  {
    type: "hero",
    label: "Hero",
    defaults: {
      headline: "INTELLIGENT SYSTEM INTEGRATION",
      subhead: "ARMR ALEYE",
      ctaLabel: "Explore",
      ctaHref: "/solutions.html",
      showHamsa: true,
    },
  },
  {
    type: "trinity",
    label: "Trinity strip",
    defaults: { items: ["OS", "Area 44", "JHETTI"] },
  },
  {
    type: "product",
    label: "Product card",
    defaults: {
      name: "ARMR Product Engine",
      price: "$77",
      blurb: "Turn frameworks into action-ready products.",
      ctaLabel: "Get ARMR Product Engine",
      ctaHref: "https://www.armraleye.com",
      mark: "Hand of Hamsa",
    },
  },
  {
    type: "features",
    label: "Features",
    defaults: {
      items: ["Zero Trust", "Command Center", "Native CRM", "Product Engine"],
    },
  },
  {
    type: "text",
    label: "Text",
    defaults: { body: "Values-aligned intelligent system." },
  },
  {
    type: "cta",
    label: "CTA band",
    defaults: {
      headline: "Ship your next product",
      ctaLabel: "Open catalog",
      ctaHref: "/solutions.html",
    },
  },
  {
    type: "faq",
    label: "FAQ",
    defaults: {
      items: ["What is ARMR Product Engine?", "Is this medical advice? No."],
    },
  },
  {
    type: "image",
    label: "Image",
    defaults: { src: "/assets/hero/hero.jpg", alt: "ARMR ALEYE" },
  },
  { type: "divider", label: "Divider", defaults: {} },
  {
    type: "html",
    label: "Custom HTML",
    defaults: { html: "<!-- custom -->" },
  },
];

export function createBlock(type: BlockType): PageBlock {
  const cat = BLOCK_CATALOG.find((b) => b.type === type);
  return {
    id: uid(),
    type,
    props: { ...(cat?.defaults ?? {}) },
  };
}

export function createHomePage(): SitePage {
  return {
    id: uid(),
    slug: "home",
    title: "ARMR ALEYE \u2014 Intelligent System Integration",
    description:
      "Values-aligned intelligent system. ARMR Product Engine. Hand of Hamsa packaging.",
    status: "draft",
    brand: "armr-aleye",
    updatedAt: new Date().toISOString(),
    blocks: [
      createBlock("hero"),
      createBlock("trinity"),
      createBlock("product"),
      createBlock("features"),
      createBlock("cta"),
    ],
  };
}

export function createBlankProject(name = "ARMR ALEYE Site"): SiteProject {
  return {
    id: uid(),
    name,
    domain: "www.armraleye.com",
    theme: "void-dark",
    pages: [createHomePage()],
    createdAt: new Date().toISOString(),
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderBlock(block: PageBlock): string {
  const p = block.props;
  switch (block.type) {
    case "hero":
      return `<section class="aa-hero" data-block="${block.id}">
  <div class="aa-hero-inner">
    ${p.showHamsa ? `<div class="aa-hamsa" aria-hidden="true"></div>` : ""}
    <p class="aa-eyebrow">${esc(String(p.subhead ?? "ARMR ALEYE"))}</p>
    <h1>${esc(String(p.headline ?? ""))}</h1>
    <a class="aa-btn" href="${esc(String(p.ctaHref ?? "#"))}">${esc(String(p.ctaLabel ?? "Explore"))}</a>
  </div>
</section>`;
    case "trinity": {
      const items = Array.isArray(p.items) ? p.items : ["OS", "Area 44", "JHETTI"];
      return `<section class="aa-trinity" data-block="${block.id}">
  ${items.map((i) => `<div class="aa-card">${esc(String(i))}</div>`).join("\n  ")}
</section>`;
    }
    case "product":
      return `<section class="aa-product" data-block="${block.id}">
  <div class="aa-product-card">
    <span class="aa-mark">${esc(String(p.mark ?? "Hand of Hamsa"))}</span>
    <h2>${esc(String(p.name ?? "ARMR Product Engine"))}</h2>
    <p class="aa-price">${esc(String(p.price ?? "$77"))}</p>
    <p>${esc(String(p.blurb ?? ""))}</p>
    <a class="aa-btn" href="${esc(String(p.ctaHref ?? "#"))}">${esc(String(p.ctaLabel ?? "Get"))}</a>
  </div>
</section>`;
    case "features": {
      const items = Array.isArray(p.items) ? p.items : [];
      return `<section class="aa-features" data-block="${block.id}">
  <ul>${items.map((i) => `<li>${esc(String(i))}</li>`).join("")}</ul>
</section>`;
    }
    case "text":
      return `<section class="aa-text" data-block="${block.id}"><p>${esc(String(p.body ?? ""))}</p></section>`;
    case "cta":
      return `<section class="aa-cta" data-block="${block.id}">
  <h2>${esc(String(p.headline ?? ""))}</h2>
  <a class="aa-btn" href="${esc(String(p.ctaHref ?? "#"))}">${esc(String(p.ctaLabel ?? "Go"))}</a>
</section>`;
    case "faq": {
      const items = Array.isArray(p.items) ? p.items : [];
      return `<section class="aa-faq" data-block="${block.id}">
  ${items.map((i) => `<div class="aa-faq-item"><p>${esc(String(i))}</p></div>`).join("\n  ")}
</section>`;
    }
    case "image":
      return `<section class="aa-image" data-block="${block.id}">
  <img src="${esc(String(p.src ?? ""))}" alt="${esc(String(p.alt ?? ""))}" loading="lazy" />
</section>`;
    case "divider":
      return `<hr class="aa-divider" data-block="${block.id}" />`;
    case "html":
      return `<!-- custom ${block.id} -->\n${String(p.html ?? "")}`;
    default:
      return `<!-- unknown block ${block.type} -->`;
  }
}

const BASE_CSS = `
:root{--void:#0A0B0F;--panel:#12141A;--gold:#C9A227;--text:#E8E6E3;--muted:#8B909A}
*{box-sizing:border-box}body{margin:0;background:var(--void);color:var(--text);font-family:system-ui,sans-serif}
.aa-hero{min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:3rem 1.5rem}
.aa-hero h1{font-size:clamp(1.6rem,4vw,2.8rem);letter-spacing:.06em;font-weight:500}
.aa-eyebrow{color:var(--gold);text-transform:uppercase;letter-spacing:.12em;font-size:.8rem}
.aa-btn{display:inline-block;margin-top:1.25rem;padding:.75rem 1.5rem;border:1px solid var(--gold);color:var(--gold);text-decoration:none;border-radius:8px}
.aa-trinity{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;padding:2rem;max-width:900px;margin:0 auto}
.aa-card{background:rgba(255,255,255,.04);border:1px solid rgba(201,162,39,.25);border-radius:12px;padding:1.5rem;text-align:center;color:var(--gold)}
.aa-product{padding:2rem;display:flex;justify-content:center}
.aa-product-card{background:rgba(255,255,255,.04);border-radius:16px;padding:2rem;max-width:420px;text-align:center;border:1px solid rgba(255,255,255,.08)}
.aa-mark{font-size:.75rem;color:var(--gold)}
.aa-price{font-size:1.5rem;color:var(--gold)}
.aa-features ul{list-style:none;padding:2rem;max-width:600px;margin:0 auto}
.aa-features li{padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,.06)}
.aa-cta{text-align:center;padding:3rem 1.5rem}
.aa-text{max-width:640px;margin:0 auto;padding:1.5rem;color:var(--muted)}
.aa-faq{max-width:640px;margin:0 auto;padding:1.5rem}
.aa-image img{max-width:100%;display:block;margin:0 auto}
.aa-divider{border:0;border-top:1px solid rgba(255,255,255,.08);margin:2rem auto;max-width:200px}
`;

export function renderPageHtml(page: SitePage): string {
  const body = page.blocks.map(renderBlock).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(page.title)}</title>
  ${page.description ? `<meta name="description" content="${esc(page.description)}" />` : ""}
  <style>${BASE_CSS}</style>
</head>
<body>
${body}
<footer style="text-align:center;padding:2rem;color:#8B909A;font-size:.8rem">
  ARMR ALEYE \u00b7 Hand of Hamsa\u2122 packaging \u00b7 Not medical advice
</footer>
</body>
</html>`;
}

export function exportShopifySection(block: PageBlock): object {
  return {
    name: `ARMR ${block.type}`,
    tag: "section",
    class: "aa-section",
    settings: Object.keys(block.props).map((key) => ({
      type: "text",
      id: key,
      label: key,
      default: String(block.props[key] ?? ""),
    })),
    presets: [{ name: `ARMR ${block.type}` }],
  };
}

export function createSiteFromBrief(brief: {
  name?: string;
  includeProduct?: boolean;
  includeTrinity?: boolean;
}): SiteProject {
  const project = createBlankProject(brief.name ?? "ARMR ALEYE Site");
  const home = project.pages[0];
  home.blocks = [createBlock("hero")];
  if (brief.includeTrinity !== false) home.blocks.push(createBlock("trinity"));
  if (brief.includeProduct !== false) home.blocks.push(createBlock("product"));
  home.blocks.push(createBlock("features"), createBlock("cta"));
  home.updatedAt = new Date().toISOString();
  return project;
}
