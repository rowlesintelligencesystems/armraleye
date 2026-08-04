/**
 * Website Creation Tool + Page Builder API
 * /api/builder/*
 */
import { Hono } from "hono";
import type { Env } from "../lib/types";
import {
  BLOCK_CATALOG,
  createBlock,
  createSiteFromBrief,
  exportShopifySection,
  renderPageHtml,
  type BlockType,
  type SiteProject,
} from "../lib/systems/page-builder";

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

const memory = new Map<string, SiteProject>();

const builder = new Hono<{ Bindings: Env }>();

builder.get("/catalog", (c) => c.json({ blocks: BLOCK_CATALOG }));

builder.post("/projects", async (c) => {
  if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json().catch(() => ({}));
  const project = createSiteFromBrief({
    name: body?.name,
    includeProduct: body?.includeProduct,
    includeTrinity: body?.includeTrinity,
  });
  memory.set(project.id, project);
  return c.json(project, 201);
});

builder.get("/projects/:id", (c) => {
  const p = memory.get(c.req.param("id"));
  if (!p) return c.json({ error: "Not found" }, 404);
  return c.json(p);
});

builder.get("/projects/:id/pages/:slug/html", (c) => {
  const p = memory.get(c.req.param("id"));
  if (!p) return c.json({ error: "Not found" }, 404);
  const page = p.pages.find((x) => x.slug === c.req.param("slug"));
  if (!page) return c.json({ error: "Page not found" }, 404);
  return c.html(renderPageHtml(page));
});

builder.post("/projects/:id/pages/:slug/blocks", async (c) => {
  if (!isAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  const p = memory.get(c.req.param("id"));
  if (!p) return c.json({ error: "Not found" }, 404);
  const page = p.pages.find((x) => x.slug === c.req.param("slug"));
  if (!page) return c.json({ error: "Page not found" }, 404);
  const body = await c.req.json<{ type?: BlockType }>().catch(() => null);
  if (!body?.type) return c.json({ error: "type required" }, 400);
  const block = createBlock(body.type);
  page.blocks.push(block);
  page.updatedAt = new Date().toISOString();
  return c.json(block, 201);
});

builder.get("/shopify/export/:type", (c) => {
  const type = c.req.param("type") as BlockType;
  const block = createBlock(type);
  return c.json(exportShopifySection(block));
});

builder.get("/health", (c) =>
  c.json({
    tool: "ARMR Website Creation Tool + Page Builder",
    status: "active",
    blocks: BLOCK_CATALOG.length,
    storage: "memory-dev",
  }),
);

export default builder;
