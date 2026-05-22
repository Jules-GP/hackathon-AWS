/**
 * ============================================================
 * FICHIER : src/content/index.ts
 * RÔLE    : Content Script — extraction du contenu de la page
 * ============================================================
 * Gère :
 * - Extraction du texte pertinent (suppression nav, footer, ads)
 * - Troncature à ~4000 tokens (15000 caractères)
 * - Détection de la sélection utilisateur
 * - MutationObserver pour les SPA (détecte les changements de page)
 * - Réponse aux messages du Service Worker
 * ============================================================
 */

// Sélecteurs des éléments à supprimer (bruit)
const SELECTORS_TO_REMOVE = [
  "nav", "footer", "header", "aside",
  "script", "style", "noscript", "iframe",
  "[role='banner']", "[role='navigation']", "[role='complementary']",
  "[aria-hidden='true']", ".ad", ".ads", ".advertisement",
  ".cookie-banner", ".popup", ".modal",
];

// Limite de caractères (~4000 tokens)
const MAX_CONTENT_LENGTH = 15000;

// --- Extraction du contenu textuel nettoyé ---
function extractPageContent(): string {
  const clone = document.body.cloneNode(true) as HTMLElement;

  // Supprimer les éléments non pertinents
  SELECTORS_TO_REMOVE.forEach((selector) => {
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Nettoyer les espaces multiples et retourner le texte tronqué
  const text = clone.innerText.replace(/\s+/g, " ").trim();
  return text.slice(0, MAX_CONTENT_LENGTH);
}

// --- Récupère le texte sélectionné par l'utilisateur ---
function getSelectedText(): string {
  return window.getSelection()?.toString().trim() || "";
}

// --- Écoute les messages du Service Worker ---
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "get_page_content") {
    sendResponse({
      title: document.title,
      url: window.location.href,
      content: extractPageContent(),
      selectedText: getSelectedText(),
    });
  }
  return true; // Réponse asynchrone
});

// --- MutationObserver pour les SPA ---
// Détecte les changements majeurs de contenu (navigation SPA)
let lastUrl = window.location.href;

const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  // Si l'URL a changé, notifier le background (nouvelle page)
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    chrome.runtime.sendMessage({ type: "page_changed", url: currentUrl }).catch(() => {
      // Ignorer si le background n'écoute pas ce message
    });
  }
});

// Observer les changements dans le body (ajout/suppression de nœuds)
observer.observe(document.body, { childList: true, subtree: true });
