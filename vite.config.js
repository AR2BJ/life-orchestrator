import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), VitePWA()],
  resolve: {
    alias: {
      "@life-orchestrator/core-store": path.resolve(
        __dirname,
        "./packages/core-store/src",
      ),
      "@life-orchestrator/event-bus": path.resolve(
        __dirname,
        "./packages/event-bus/src",
      ),
      "@life-orchestrator/ui-theme": path.resolve(
        __dirname,
        "./packages/ui-theme/src",
      ),
    },
  },
  build: {
    target: "esnext",
  },
});
