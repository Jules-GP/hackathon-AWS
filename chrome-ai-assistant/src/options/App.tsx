/**
 * ============================================================
 * FICHIER : src/options/App.tsx
 * RÔLE    : Page de paramètres de l'extension
 * RESPONSABLE : Personne A
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Formulaire de saisie de la clé API (masquée)
 * 2. Sélecteur de modèle (GPT-4o-mini, GPT-4o, Claude Sonnet)
 * 3. Choix de la langue de réponse
 * 4. Bouton de sauvegarde → chrome.storage.local
 * 5. Feedback visuel (sauvegardé / erreur)
 * 6. Bouton "Tester la clé" pour valider la connexion API
 * ============================================================
 */

import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "@shared/storage";
import type { Settings } from "@shared/types";

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    model: "gpt-4o-mini",
    language: "fr",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">⚙️ Paramètres — AI Assistant</h1>

      <label className="block">
        <span className="text-sm font-medium">Clé API</span>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
          className="mt-1 block w-full rounded border px-3 py-2 text-sm"
          placeholder="sk-..."
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Modèle</span>
        <select
          value={settings.model}
          onChange={(e) => setSettings({ ...settings, model: e.target.value })}
          className="mt-1 block w-full rounded border px-3 py-2 text-sm"
        >
          <option value="gpt-4o-mini">GPT-4o-mini</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="claude-sonnet">Claude Sonnet</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Langue de réponse</span>
        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="mt-1 block w-full rounded border px-3 py-2 text-sm"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </label>

      <button
        onClick={handleSave}
        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        Sauvegarder
      </button>

      {saved && <p className="text-green-600 text-sm">✓ Paramètres sauvegardés</p>}
    </div>
  );
}
