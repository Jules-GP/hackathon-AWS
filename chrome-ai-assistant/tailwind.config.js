/**
 * ============================================================
 * FICHIER : tailwind.config.js
 * RÔLE    : Configuration Tailwind CSS pour le Side Panel et Options
 * ------------------------------------------------------------
 * À FAIRE :
 * - Personnaliser le thème (couleurs, fonts) selon la charte graphique
 * - Ajouter des plugins si nécessaire (typography, forms)
 * ============================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/panel/**/*.{tsx,ts}", "./src/options/**/*.{tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
