/**
 * ============================================================
 * FICHIER : src/panel/components/QuickActions.tsx
 * RÔLE    : Boutons d'actions rapides prédéfinies
 * RESPONSABLE : Personne A
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Bouton "Résumer la page"
 * 2. Bouton "Expliquer la sélection"
 * 3. Bouton "Traduire"
 * 4. Possibilité d'ajouter des actions personnalisées
 * ============================================================
 */

interface Props {
  onAction: (prompt: string) => void;
  disabled: boolean;
}

const ACTIONS = [
  { label: "📝 Résumer", prompt: "Fais un résumé concis de cette page." },
  { label: "❓ Expliquer", prompt: "Explique le contenu de cette page simplement." },
  { label: "🌐 Traduire", prompt: "Traduis le contenu principal de cette page en français." },
];

export default function QuickActions({ onAction, disabled }: Props) {
  return (
    <div className="flex gap-1 flex-wrap">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => onAction(action.prompt)}
          disabled={disabled}
          className="rounded-full border px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
