/**
 * ============================================================
 * FICHIER : src/panel/main.tsx
 * RÔLE    : Bootstrap React pour le Side Panel
 * ------------------------------------------------------------
 * À FAIRE :
 * - Importer les styles globaux (Tailwind)
 * - Monter le composant App dans le DOM
 * ============================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
