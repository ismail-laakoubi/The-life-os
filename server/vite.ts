import type { Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer } from "vite";
import path from "path";

export async function setupVite(httpServer: Server, app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server: httpServer } },
    appType: "spa",
    root: path.resolve(import.meta.dirname, "..", "client"),
  });

  app.use(vite.middlewares);
}
