/**
 * ============================================================
 * FICHIER : tests/content.test.ts
 * RÔLE    : Tests unitaires du Content Script (extraction DOM)
 * RESPONSABLE : Personne C
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Tester extractPageContent() avec différents HTML
 * 2. Vérifier que les éléments nav/footer/aside sont supprimés
 * 3. Vérifier la troncature à MAX_CONTENT_LENGTH
 * 4. Tester getSelectedText()
 *
 * COMMANDE : npm run test
 * ============================================================
 */

import { describe, it, expect } from "vitest";

describe("Content Script — extractPageContent", () => {
  it.todo("devrait extraire le texte principal de la page");
  it.todo("devrait supprimer les éléments de navigation");
  it.todo("devrait tronquer le contenu au-delà de 15000 caractères");
});

describe("Content Script — getSelectedText", () => {
  it.todo("devrait retourner le texte sélectionné");
  it.todo("devrait retourner une chaîne vide si rien n'est sélectionné");
});
