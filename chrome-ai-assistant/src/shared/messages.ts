/**
 * ============================================================
 * FICHIER : src/shared/messages.ts
 * RÔLE    : Protocole de messages entre composants de l'extension
 * RESPONSABLE : Personne B
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Définir tous les types de messages (type-safe)
 * 2. Helpers pour envoyer/recevoir des messages typés
 * 3. Constantes pour les noms de ports
 * ============================================================
 */

// Noms de ports pour les connexions longue durée
export const PORTS = {
  CHAT_STREAM: "chat-stream",
} as const;

// Types de messages Content Script ↔ Background
export type ContentMessage = {
  type: "get_page_content";
};

// Types de messages Panel → Background (via port)
export type ChatRequest = {
  type: "chat";
  content: string;
  tabId: number;
};

// Types de messages Background → Panel (via port)
export type StreamToken = {
  type: "token";
  content: string;
};

export type StreamDone = {
  type: "done";
};

export type StreamError = {
  type: "error";
  message: string;
};

export type StreamMessage = StreamToken | StreamDone | StreamError;
