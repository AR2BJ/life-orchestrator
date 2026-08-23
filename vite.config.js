import { defineConfig } from "vite";
import jsconfigPaths from "vite-jsconfig-paths";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    jsconfigPaths(),
    {
      name: "clean-url-rewriter",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url.split("?")[0];

          if (rawUrl === "/habit-tracker" || rawUrl === "/habit-tracker/") {
            req.url = "/modules/habit-tracker/index.html";
          } else if (
            rawUrl === "/task-manager" ||
            rawUrl === "/task-manager/"
          ) {
            req.url = "/modules/task-manager/index.html";
          } else if (
            rawUrl === "/time-manager" ||
            rawUrl === "/time-manager/"
          ) {
            req.url = "/modules/time-manager/index.html";
          }

          next();
        });
      },
    },
  ],

  resolve: {
    alias: {
      "@life-orchestrator/core-store": path.resolve(
        __dirname,
        "packages/core-store/src",
      ),
      "@life-orchestrator/ui-theme": path.resolve(
        __dirname,
        "packages/ui-theme/src",
      ),
      "@life-orchestrator/event-bus": path.resolve(
        __dirname,
        "packages/event-bus/src",
      ),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        habit: path.resolve(__dirname, "modules/habit-tracker/index.html"),
        task: path.resolve(__dirname, "modules/task-manager/index.html"),
        time: path.resolve(__dirname, "modules/time-manager/index.html"),
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },
});
