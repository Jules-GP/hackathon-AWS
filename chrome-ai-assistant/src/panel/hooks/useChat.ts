/**
 * ============================================================
 * FICHIER : src/panel/hooks/useChat.ts
 * RÔLE    : Hook React gérant la logique de conversation
 * RESPONSABLE : Personne A
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Maintenir la liste des messages (state)
 * 2. Ouvrir un port vers le Service Worker pour le streaming
 * 3. Envoyer le message utilisateur + contexte page
 * 4. Recevoir les tokens en streaming et mettre à jour le dernier message
 * 5. Gérer l'état isLoading
 * 6. Persister/charger l'historique depuis chrome.storage
 * ============================================================
 */

import { useState, useCallback } from "react";
import type { ChatMessage } from "@shared/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    (content: string) => {
      if (isLoading) return;

      // Ajouter le message utilisateur
      setMessages((prev) => [...prev, { role: "user", content }]);
      setIsLoading(true);

      // TODO: Ouvrir un port "chat-stream" vers le background
      // TODO: Envoyer { type: "chat", content, tabId }
      // TODO: Écouter les tokens et construire la réponse progressivement
      // TODO: Sur "done", setIsLoading(false)

      // Placeholder — à remplacer par le streaming réel
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "..." },
      ]);
      setIsLoading(false);
    },
    [isLoading]
  );

  return { messages, sendMessage, isLoading };
}
