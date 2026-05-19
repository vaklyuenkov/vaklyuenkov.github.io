import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site vaklyuenkov.github.io is served from /. Override with VITE_BASE if needed.
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
