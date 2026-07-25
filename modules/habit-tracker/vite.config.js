import { URL, fileURLToPath } from "node:url";

import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), VitePWA()],
  server: {
    fs: {
      allow: ["../../"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@life-orchestrator/core-store": path.resolve(
        __dirname,
        "../../packages/core-store/src",
      ),
      "@life-orchestrator/ui-theme": path.resolve(
        __dirname,
        "../../packages/ui-theme/src",
      ),
    },
  },
});
