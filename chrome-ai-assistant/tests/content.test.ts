/**
 * ============================================================
 * FICHIER : tests/content.test.ts
 * RÔLE    : Tests unitaires du Content Script (extraction DOM)
 * ============================================================
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";

// Simuler les fonctions d'extraction (on les re-déclare ici car le content script
// n'exporte pas ses fonctions — elles sont internes)
const SELECTORS_TO_REMOVE = [
  "nav", "footer", "header", "aside", "script", "style", "noscript", "iframe",
  "[role='banner']", "[role='navigation']", "[role='complementary']",
  "[aria-hidden='true']",
];
const MAX_CONTENT_LENGTH = 15000;

function extractPageContent(doc: Document): string {
  const clone = doc.body.cloneNode(true) as HTMLElement;
  SELECTORS_TO_REMOVE.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });
  const text = clone.innerText?.replace(/\s+/g, " ").trim() || clone.textContent?.replace(/\s+/g, " ").trim() || "";
  return text.slice(0, MAX_CONTENT_LENGTH);
}

describe("Content Script — extractPageContent", () => {
  it("devrait extraire le texte principal de la page", () => {
    const dom = new JSDOM(`<body><main><p>Contenu principal de l'article.</p></main></body>`);
    const result = extractPageContent(dom.window.document);
    expect(result).toContain("Contenu principal");
  });

  it("devrait supprimer les éléments de navigation", () => {
    const dom = new JSDOM(`<body>
      <nav>Menu de navigation</nav>
      <main><p>Contenu utile</p></main>
      <footer>Pied de page</footer>
    </body>`);
    const result = extractPageContent(dom.window.document);
    expect(result).not.toContain("Menu de navigation");
    expect(result).not.toContain("Pied de page");
    expect(result).toContain("Contenu utile");
  });

  it("devrait supprimer les éléments avec role='banner'", () => {
    const dom = new JSDOM(`<body>
      <div role="banner">Bannière pub</div>
      <article>Article intéressant</article>
    </body>`);
    const result = extractPageContent(dom.window.document);
    expect(result).not.toContain("Bannière pub");
    expect(result).toContain("Article intéressant");
  });

  it("devrait tronquer le contenu au-delà de 15000 caractères", () => {
    const longText = "A".repeat(20000);
    const dom = new JSDOM(`<body><p>${longText}</p></body>`);
    const result = extractPageContent(dom.window.document);
    expect(result.length).toBeLessThanOrEqual(MAX_CONTENT_LENGTH);
  });

  it("devrait gérer une page vide", () => {
    const dom = new JSDOM(`<body></body>`);
    const result = extractPageContent(dom.window.document);
    expect(result).toBe("");
  });
});
