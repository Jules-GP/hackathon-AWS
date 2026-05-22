/**
 * ============================================================
 * FICHIER : src/panel/components/ChatMessage.tsx
 * RÔLE    : Affiche un message individuel (utilisateur ou IA)
 * RESPONSABLE : Personne A
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Différencier visuellement les messages user vs assistant
 * 2. Supporter le rendu Markdown (gras, code, listes)
 * 3. Afficher un indicateur de chargement pendant le streaming
 * 4. Ajouter un bouton "copier" sur les réponses IA
 * ============================================================
 */

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
