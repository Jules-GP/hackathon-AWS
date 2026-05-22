/**
 * ============================================================
 * FICHIER : src/shared/storage.ts
 * RÔLE    : Helpers pour chrome.storage.local (lecture/écriture)
 * RESPONSABLE : Personne B
 * ------------------------------------------------------------
 * À FAIRE :
 *
 * 1. getSettings / saveSettings — paramètres utilisateur
 * 2. getConversation / saveConversation — historique par onglet
 * 3. clearHistory — suppression de l'historique
 * ============================================================
 */

import type { Settings, Conversation } from "./types";

const DEFAULTS: Settings = {
  apiKey: "",
  model: "gpt-4o-mini",
  language: "fr",
};

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get("settings");
  return { ...DEFAULTS, ...result.settings };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ settings });
}

export async function getConversation(tabId: number): Promise<Conversation | null> {
  const key = `conv_${tabId}`;
  const result = await chrome.storage.local.get(key);
  return result[key] || null;
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  const key = `conv_${conversation.tabId}`;
  await chrome.storage.local.set({ [key]: conversation });
}

export async function clearHistory(): Promise<void> {
  const all = await chrome.storage.local.get(null);
  const convKeys = Object.keys(all).filter((k) => k.startsWith("conv_"));
  await chrome.storage.local.remove(convKeys);
}
