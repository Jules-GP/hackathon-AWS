/**
 * ============================================================
 * FICHIER : tests/storage.test.ts
 * RÔLE    : Tests unitaires des helpers de stockage
 * ============================================================
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock chrome.storage.local
const mockStorage: Record<string, unknown> = {};

const chromeStorageMock = {
  get: vi.fn((keys: string | string[] | null) => {
    if (keys === null) return Promise.resolve({ ...mockStorage });
    if (typeof keys === "string") return Promise.resolve({ [keys]: mockStorage[keys] });
    const result: Record<string, unknown> = {};
    (keys as string[]).forEach((k) => { result[k] = mockStorage[k]; });
    return Promise.resolve(result);
  }),
  set: vi.fn((items: Record<string, unknown>) => {
    Object.assign(mockStorage, items);
    return Promise.resolve();
  }),
  remove: vi.fn((keys: string[]) => {
    keys.forEach((k) => delete mockStorage[k]);
    return Promise.resolve();
  }),
};

// Injecter le mock global chrome
vi.stubGlobal("chrome", { storage: { local: chromeStorageMock } });

// Importer après le mock
import { getSettings, saveSettings, getConversation, saveConversation, clearHistory } from "../src/shared/storage";

describe("Storage — getSettings", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    vi.clearAllMocks();
  });

  it("devrait retourner les paramètres par défaut si rien n'est stocké", async () => {
    const settings = await getSettings();
    expect(settings.apiKey).toBe("");
    expect(settings.model).toBe("gpt-4o-mini");
    expect(settings.language).toBe("fr");
  });

  it("devrait retourner les paramètres sauvegardés", async () => {
    await saveSettings({ apiKey: "sk-test", model: "gpt-4o", language: "en" });
    const settings = await getSettings();
    expect(settings.apiKey).toBe("sk-test");
    expect(settings.model).toBe("gpt-4o");
    expect(settings.language).toBe("en");
  });
});

describe("Storage — conversations", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    vi.clearAllMocks();
  });

  it("devrait sauvegarder et récupérer une conversation par tabId", async () => {
    const conv = {
      id: "test-id",
      tabId: 42,
      messages: [{ role: "user" as const, content: "Bonjour" }],
      createdAt: Date.now(),
    };
    await saveConversation(conv);
    const result = await getConversation(42);
    expect(result).toEqual(conv);
  });

  it("devrait retourner null si aucune conversation n'existe", async () => {
    const result = await getConversation(999);
    expect(result).toBeNull();
  });

  it("devrait supprimer toutes les conversations avec clearHistory", async () => {
    mockStorage["conv_1"] = { id: "1", tabId: 1, messages: [], createdAt: 0 };
    mockStorage["conv_2"] = { id: "2", tabId: 2, messages: [], createdAt: 0 };
    mockStorage["settings"] = { apiKey: "sk-keep" };

    await clearHistory();

    expect(mockStorage["conv_1"]).toBeUndefined();
    expect(mockStorage["conv_2"]).toBeUndefined();
    // Les settings ne doivent pas être supprimés
    expect(mockStorage["settings"]).toBeDefined();
  });
});
