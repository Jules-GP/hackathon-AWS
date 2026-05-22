/**
 * ============================================================
 * FICHIER : src/panel/hooks/useChat.ts
 * RÔLE    : Hook React gérant la logique de conversation
 * ============================================================
 * Gère :
 * - Liste des messages (state React)
 * - Ouverture d'un port vers le Service Worker pour le streaming
 * - Envoi du message utilisateur + tabId
 * - Réception des tokens en streaming (mise à jour progressive)
 * - État isLoading pendant la génération
 * - Chargement de l'historique depuis chrome.storage
 * ============================================================
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatMessage } from "@shared/types";
import type { StreamMessage } from "@shared/messages";
import { PORTS } from "@shared/messages";
import { getConversation } from "@shared/storage";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const portRef = useRef<chrome.runtime.Port | null>(null);

  // Charger l'historique au montage (basé sur l'onglet actif)
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.id) {
        getConversation(tab.id).then((conv) => {
          if (conv?.messages.length) {
            setMessages(conv.messages);
          }
        });
      }
    });
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (isLoading || !content.trim()) return;
      setError(null);

      // Ajouter le message utilisateur à l'affichage
      const userMsg: ChatMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Ouvrir un port vers le background pour recevoir le stream
      const port = chrome.runtime.connect({ name: PORTS.CHAT_STREAM });
      portRef.current = port;

      // Ajouter un message assistant vide (sera rempli token par token)
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Écouter les messages du background (tokens, done, error)
      port.onMessage.addListener((msg: StreamMessage) => {
        switch (msg.type) {
          case "token":
            // Ajouter le token au dernier message (assistant)
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, content: last.content + msg.content };
              return updated;
            });
            break;

          case "done":
            setIsLoading(false);
            port.disconnect();
            portRef.current = null;
            break;

          case "error":
            setError(msg.message);
            setIsLoading(false);
            // Retirer le message assistant vide en cas d'erreur
            setMessages((prev) => prev.slice(0, -1));
            port.disconnect();
            portRef.current = null;
            break;
        }
      });

      // Gérer la déconnexion inattendue du port
      port.onDisconnect.addListener(() => {
        if (isLoading) setIsLoading(false);
        portRef.current = null;
      });

      // Envoyer la requête au background avec le tabId
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        port.postMessage({ type: "chat", content, tabId: tab?.id || 0 });
      });
    },
    [isLoading]
  );

  // Réinitialiser la conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, sendMessage, isLoading, error, clearMessages };
}
