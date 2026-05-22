/**
 * ============================================================
 * FICHIER : tests/messages.test.ts
 * RÔLE    : Tests unitaires du protocole de messages
 * RESPONSABLE : Personne C
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. Vérifier la structure des messages typés
 * 2. Tester les constantes de ports
 * 3. Tests d'intégration : envoi/réception entre composants mockés
 *
 * COMMANDE : npm run test
 * ============================================================
 */

import { describe, it, expect } from "vitest";
import { PORTS } from "../src/shared/messages";

describe("Messages — constantes", () => {
  it("devrait avoir le port chat-stream défini", () => {
    expect(PORTS.CHAT_STREAM).toBe("chat-stream");
  });
});

describe("Messages — typage", () => {
  it.todo("devrait valider la structure d'un ChatRequest");
  it.todo("devrait valider la structure d'un StreamToken");
});
