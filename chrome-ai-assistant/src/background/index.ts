/**
 * ============================================================
 * FICHIER : src/background/index.ts
 * RÔLE    : Service Worker (Manifest V3) — cerveau de l'extension
 * RESPONSABLE : Personne B
 * ------------------------------------------------------------
 * FONCTIONNALITÉS À IMPLÉMENTER :
 *
 * 1. Écouter les messages du Side Panel (questions utilisateur)
 * 2. Demander le contenu de la page au Content Script
 * 3. Construire le prompt système (contexte page + historique)
 * 4. Appeler l'API LLM en streaming (fetch + ReadableStream)
 * 5. Relayer les tokens au Panel via chrome.runtime.Port
 * 6. Gérer le stockage de l'historique (chrome.storage.local)
 * 7. Gérer les erreurs (rate limit, timeout, clé invalide)
 * 8. Ouvrir le Side Panel au clic sur l'icône de l'extension
 * ============================================================
 */

// Ouvre le Side Panel au clic sur l'icône
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Écoute les connexions longue durée (ports) pour le streaming
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "chat-stream") {
    port.onMessage.addListener(async (msg) => {
      // TODO: Implémenter le flux complet
      // 1. Récupérer le contenu de la page via le content script
      // 2. Construire le prompt
      // 3. Appeler l'API en streaming
      // 4. Relayer chaque token via port.postMessage()
    });
  }
});

// Écoute les messages simples (one-shot)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // TODO: Gérer les messages non-streaming (ex: récupérer historique)
  return true; // Indique une réponse asynchrone
});
