/**
 * ============================================================
 * FICHIER : src/panel/components/ChatInput.tsx
 * RÔLE    : Champ de saisie du message utilisateur
 * RESPONSABLE : Personne A
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Input texte avec envoi sur Enter (Shift+Enter = nouvelle ligne)
 * 2. Bouton d'envoi
 * 3. Désactiver pendant le chargement (prop disabled)
 * 4. Auto-resize du textarea
 * ============================================================
 */

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Posez une question sur la page..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
      >
        ➤
      </button>
    </div>
  );
}
