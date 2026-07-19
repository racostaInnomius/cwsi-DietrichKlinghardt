import { defineConfig, type Plugin } from "vite";
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

export default defineConfig({
  plugins: [react(), copyHtaccess()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { port: 4325 },
});
