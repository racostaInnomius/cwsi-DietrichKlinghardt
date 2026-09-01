import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));

function copyHtaccess(): Plugin {
  return {
    name: "copy-htaccess",
    closeBundle() {
      const source = join(root, "public", ".htaccess");
      const destination = join(root, "dist");
      if (existsSync(source) && existsSync(destination)) {
        copyFileSync(source, join(destination, ".htaccess"));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const buildEnv = loadEnv(mode, root, "");
  const cmsTarget = buildEnv.VITE_PUBLIC_CMS_URL || "http://localhost:3000";

  return {
    plugins: [react(), copyHtaccess()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    server: {
      port: 4325,
      // Payload intentionally allows only known public origins. Proxying CMS
      // reads in local development keeps that production allow-list tight
      // while letting the browser load the same records the SSG build sees.
      proxy: {
        "/__cms": {
          target: cmsTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/__cms/, ""),
        },
      },
    },
  };
});
