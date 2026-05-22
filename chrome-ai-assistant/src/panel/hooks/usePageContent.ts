/**
 * ============================================================
 * FICHIER : src/panel/hooks/usePageContent.ts
 * RÔLE    : Hook React pour récupérer le contenu de la page active
 * ============================================================
 * Gère :
 * - Envoi d'un message au content script pour obtenir le contenu
 * - Stockage du contenu dans le state
 * - Re-fetch quand l'onglet actif change
 * - Exposition du titre, URL, contenu et texte sélectionné
 * ============================================================
 */

import { useState, useEffect } from "react";
import type { PageContent } from "@shared/types";

export function usePageContent() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer le contenu de l'onglet actif
  const fetchContent = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      const response = await chrome.tabs.sendMessage(tab.id, { type: "get_page_content" });
      setPageContent(response as PageContent);
    } catch {
      // Content script pas encore injecté ou page non supportée (chrome://)
      setPageContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial au montage
    fetchContent();

    // Re-fetch quand l'onglet actif change
    const handleTabActivated = () => fetchContent();
    chrome.tabs.onActivated.addListener(handleTabActivated);

    // Re-fetch quand la page se met à jour (navigation)
    const handleTabUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.status === "complete") {
        chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
          if (tab?.id === tabId) fetchContent();
        });
      }
    };
    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, []);

  return { pageContent, loading, refetch: fetchContent };
}
