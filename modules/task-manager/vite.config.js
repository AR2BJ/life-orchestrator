import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: __dirname,

  plugins: [tailwindcss()],

  server: {
    fs: {
      allow: ["../../"],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@life-orchestrator/core-store": path.resolve(
        __dirname,
        "../../packages/core-store/src",
      ),
      "@life-orchestrator/ui-theme": path.resolve(
        __dirname,
        "../../packages/ui-theme/src",
      ),
      "@life-orchestrator/event-bus": path.resolve(
        __dirname,
        "../../packages/event-bus/src",
      ),
    },
  },
});
