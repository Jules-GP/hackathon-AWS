/**
 * ============================================================
 * FICHIER : src/content/index.ts
 * RÔLE    : Content Script — extraction du contenu de la page
 * RESPONSABLE : Personne C
 * ------------------------------------------------------------
 * FONCTIONNALITÉS À IMPLÉMENTER :
 *
 * 1. Extraire le texte pertinent de la page (title, meta, body)
 * 2. Nettoyer le DOM (supprimer nav, footer, aside, scripts, pubs)
 * 3. Tronquer le contenu à ~4000 tokens pour limiter les coûts
 * 4. Détecter la sélection de texte de l'utilisateur
 * 5. Répondre aux messages du Service Worker ("get_page_content")
 * 6. Observer les mutations DOM pour les SPA (MutationObserver)
 * ============================================================
 */

const SELECTORS_TO_REMOVE = [
  "nav",
  "footer",
  "header",
  "aside",
  "script",
  "style",
  "noscript",
  "[role='banner']",
  "[role='navigation']",
  "[aria-hidden='true']",
];

const MAX_CONTENT_LENGTH = 15000; // ~4000 tokens

function extractPageContent(): string {
  const clone = document.body.cloneNode(true) as HTMLElement;

  // Supprimer les éléments non pertinents
  SELECTORS_TO_REMOVE.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  const text = clone.innerText.replace(/\s+/g, " ").trim();
  return text.slice(0, MAX_CONTENT_LENGTH);
}

function getSelectedText(): string {
  return window.getSelection()?.toString().trim() || "";
}

// Écoute les messages du Service Worker
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "get_page_content") {
    const selectedText = getSelectedText();
    sendResponse({
      title: document.title,
      url: window.location.href,
      content: extractPageContent(),
      selectedText,
    });
  }
  return true;
});

// TODO: MutationObserver pour détecter les changements de page (SPA)
// const observer = new MutationObserver(() => { ... });
// observer.observe(document.body, { childList: true, subtree: true });
