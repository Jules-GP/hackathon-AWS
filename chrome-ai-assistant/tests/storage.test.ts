/**
 * ============================================================
 * FICHIER : tests/storage.test.ts
 * RÔLE    : Tests unitaires des helpers de stockage
 * RESPONSABLE : Personne C
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Mocker chrome.storage.local
 * 2. Tester getSettings() retourne les valeurs par défaut
 * 3. Tester saveSettings() persiste correctement
 * 4. Tester getConversation / saveConversation
 * 5. Tester clearHistory supprime uniquement les conversations
 *
 * COMMANDE : npm run test
 * ============================================================
 */

import { describe, it, expect } from "vitest";

describe("Storage — getSettings", () => {
  it.todo("devrait retourner les paramètres par défaut si rien n'est stocké");
  it.todo("devrait retourner les paramètres sauvegardés");
});

describe("Storage — conversations", () => {
  it.todo("devrait sauvegarder et récupérer une conversation par tabId");
  it.todo("devrait supprimer toutes les conversations avec clearHistory");
});
