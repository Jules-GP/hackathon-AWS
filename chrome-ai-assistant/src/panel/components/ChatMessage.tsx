/**
 * ============================================================
 * FICHIER : src/panel/components/ChatMessage.tsx
 * RÔLE    : Affiche un message individuel (utilisateur ou IA)
 * ============================================================
 * Gère :
 * - Différenciation visuelle user vs assistant
 * - Rendu markdown basique (gras, italique, code, listes)
 * - Indicateur de streaming (curseur clignotant)
 * ============================================================
 */

interface Props {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

/**
 * Rendu markdown basique sans dépendance externe.
 * Supporte : **gras**, *italique*, `code inline`, ```blocs de code```, listes (- item)
 */
function renderMarkdown(text: string): string {
  return (
    text
      // Blocs de code (```...```)
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-green-300 rounded p-2 my-1 text-xs overflow-x-auto"><code>$1</code></pre>')
      // Code inline (`...`)
      .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded text-xs">$1</code>')
      // Gras (**...**)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italique (*...*)
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Listes (- item)
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Sauts de ligne
      .replace(/\n/g, "<br/>")
  );
}

export default function ChatMessage({ role, content, isStreaming }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {isUser ? (
          // Messages utilisateur : texte brut
          <span>{content}</span>
        ) : (
          // Messages assistant : rendu markdown
          <span dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        )}

        {/* Curseur clignotant pendant le streaming */}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}
