/** ARMR Live API - see docs/ARMR_Live_API_Integration_v1.0.md */
export function apiCatalog() {
  return {
    name: "ARMR ALEYE Live API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      catalog: "GET /api",
      portal: "/api/portal/milestones",
      ppi: "/api/ppi/*",
      channels: "/api/channels",
      payments: "/api/payments/*",
    },
  };
}
