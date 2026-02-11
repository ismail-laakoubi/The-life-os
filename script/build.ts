import { build } from "vite";
import { build as buildServer } from "esbuild";
import { copyFileSync, mkdirSync } from "fs";
import path from "path";

async function buildProject() {
  console.log("Building frontend...");
  await build({ configFile: "vite.config.ts", build: { outDir: "dist/public" } });

  console.log("Building server...");
  await buildServer({
    entryPoints: ["server/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: "dist/index.cjs",
    format: "cjs",
    packages: "external",
    sourcemap: true,
  });

  console.log("Build complete!");
}

buildProject().catch(console.error);
