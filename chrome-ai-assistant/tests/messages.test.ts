/**
 * ============================================================
 * FICHIER : tests/messages.test.ts
 * RÔLE    : Tests unitaires du protocole de messages
 * ============================================================
 */

import { describe, it, expect } from "vitest";
import { PORTS } from "../src/shared/messages";
import type { ChatRequest, StreamToken, StreamDone, StreamError } from "../src/shared/messages";

describe("Messages — constantes", () => {
  it("devrait avoir le port chat-stream défini", () => {
    expect(PORTS.CHAT_STREAM).toBe("chat-stream");
  });
});

describe("Messages — typage", () => {
  it("devrait valider la structure d'un ChatRequest", () => {
    const msg: ChatRequest = { type: "chat", content: "Résume cette page", tabId: 1 };
    expect(msg.type).toBe("chat");
    expect(msg.content).toBe("Résume cette page");
    expect(msg.tabId).toBe(1);
  });

  it("devrait valider la structure d'un StreamToken", () => {
    const msg: StreamToken = { type: "token", content: "Bonjour" };
    expect(msg.type).toBe("token");
    expect(msg.content).toBe("Bonjour");
  });

  it("devrait valider la structure d'un StreamDone", () => {
    const msg: StreamDone = { type: "done" };
    expect(msg.type).toBe("done");
  });

  it("devrait valider la structure d'un StreamError", () => {
    const msg: StreamError = { type: "error", message: "Clé invalide" };
    expect(msg.type).toBe("error");
    expect(msg.message).toBe("Clé invalide");
  });
});
