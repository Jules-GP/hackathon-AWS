/**
 * ============================================================
 * FICHIER : src/shared/types.ts
 * RÔLE    : Types TypeScript partagés entre tous les composants
 * RESPONSABLE : Tous (contrat d'interface commun)
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Définir les types de messages échangés
 * 2. Définir les types de données stockées
 * 3. Maintenir à jour quand de nouvelles features sont ajoutées
 * ============================================================
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PageContent {
  title: string;
  url: string;
  content: string;
  selectedText: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  language: string;
}

export interface Conversation {
  id: string;
  tabId: number;
  messages: ChatMessage[];
  createdAt: number;
}
