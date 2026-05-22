/**
 * ============================================================
 * FICHIER : src/options/main.tsx
 * RÔLE    : Bootstrap React pour la page d'options
 * ============================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../panel/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
