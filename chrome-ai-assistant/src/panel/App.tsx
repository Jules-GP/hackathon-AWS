/**
 * ============================================================
 * FICHIER : src/panel/App.tsx
 * RÔLE    : Composant racine du Side Panel — orchestre le chat
 * ============================================================
 * Gère :
 * - Affichage de la liste des messages
 * - Auto-scroll vers le bas à chaque nouveau message/token
 * - Intégration usePageContent (affiche le titre de la page)
 * - Actions rapides et champ de saisie
 * - Affichage des erreurs
 * ============================================================
 */

import { useEffect, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import QuickActions from "./components/QuickActions";
import { useChat } from "./hooks/useChat";
import { usePageContent } from "./hooks/usePageContent";

export default function App() {
  const { messages, sendMessage, isLoading, error, clearMessages } = useChat();
  const { pageContent } = usePageContent();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas à chaque mise à jour des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header avec titre de la page */}
      <header className="p-3 border-b">
        <div className="font-semibold text-sm">🤖 AI Page Assistant</div>
        {pageContent?.title && (
          <div className="text-xs text-gray-500 truncate mt-1">
            📄 {pageContent.title}
          </div>
        )}
      </header>

      {/* Zone des messages */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Message d'accueil si aucun message */}
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            <p>👋 Posez une question sur cette page</p>
            <p className="text-xs mt-1">ou utilisez une action rapide ci-dessous</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}

        {/* Erreur */}
        {error && (
          <div className="text-red-500 text-xs bg-red-50 rounded p-2">
            ⚠️ {error}
          </div>
        )}

        {/* Ancre pour l'auto-scroll */}
        <div ref={messagesEndRef} />
      </main>

      {/* Actions rapides + Input + bouton clear */}
      <div className="border-t p-3 space-y-2">
        <QuickActions onAction={sendMessage} disabled={isLoading} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-xs text-gray-400 hover:text-gray-600 w-full"
          >
            🗑️ Effacer la conversation
          </button>
        )}
      </div>
    </div>
  );
}
