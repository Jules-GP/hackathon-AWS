/**
 * ============================================================
 * FICHIER : src/panel/hooks/usePageContent.ts
 * RÔLE    : Hook React pour récupérer le contenu de la page active
 * RESPONSABLE : Personne A / Personne C
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Au montage, envoyer un message au content script pour obtenir le contenu
 * 2. Stocker le contenu de la page dans le state
 * 3. Re-fetch quand l'onglet actif change
 * 4. Exposer le texte sélectionné s'il existe
 * ============================================================
 */

import { useState, useEffect } from "react";
import type { PageContent } from "@shared/types";

export function usePageContent() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  useEffect(() => {
    // TODO: Utiliser chrome.tabs.query pour obtenir l'onglet actif
    // TODO: Envoyer chrome.tabs.sendMessage(tabId, { type: "get_page_content" })
    // TODO: Stocker la réponse dans pageContent
  }, []);

  return pageContent;
}
