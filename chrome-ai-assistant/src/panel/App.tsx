/**
 * ============================================================
 * FICHIER : src/panel/App.tsx
 * RÔLE    : Composant racine du Side Panel — orchestre le chat
 * RESPONSABLE : Personne A
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Afficher la liste des messages (ChatMessage)
 * 2. Intégrer le champ de saisie (ChatInput)
 * 3. Afficher les actions rapides (QuickActions)
 * 4. Gérer le scroll automatique vers le bas
 * 5. Connecter le hook useChat pour la logique de conversation
 * 6. Connecter le hook usePageContent pour le contexte de page
 * ============================================================
 */

import { useState } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import QuickActions from "./components/QuickActions";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="p-3 border-b font-semibold text-sm">
        🤖 AI Page Assistant
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
      </main>

      {/* Actions rapides + Input */}
      <div className="border-t p-3 space-y-2">
        <QuickActions onAction={sendMessage} disabled={isLoading} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
