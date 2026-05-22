/**
 * ============================================================
 * FICHIER : vite.config.ts
 * RÔLE    : Configuration du bundler Vite avec le plugin CRXJS
 * ------------------------------------------------------------
 * À FAIRE :
 * - Le plugin @crxjs/vite-plugin lit manifest.json et génère
 *   automatiquement les entry points (background, content, panel)
 * - Ajouter des alias de chemins si nécessaire (@shared, @panel...)
 * ============================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "src/shared"),
      "@panel": resolve(__dirname, "src/panel"),
    },
  },
});
