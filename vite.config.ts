import path from "node:path";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async ({ mode, command }) => {
  // Load ALL env vars into process.env for server routes/server functions
  const serverEnv = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, serverEnv);

  const plugins: PluginOption[] = [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ];

  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    const preset =
      process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : undefined);
    plugins.push(
      nitro({
        ...(preset ? { preset } : { defaultPreset: "cloudflare-module" }),
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Pin entities to the hoisted v4.5.0 copy — a nested v7 breaks SSR
        "entities/lib/decode.js": path.resolve(
          __dirname,
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          __dirname,
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(__dirname, "node_modules/entities"),
      },
    },
    server: {
      port: 8080,
      host: true,
    },
  };
});
