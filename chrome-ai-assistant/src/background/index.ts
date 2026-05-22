/**
 * ============================================================
 * FICHIER : src/background/index.ts
 * RÔLE    : Service Worker (Manifest V3) — cerveau de l'extension
 * ============================================================
 * Gère :
 * - Ouverture du Side Panel au clic sur l'icône
 * - Réception des messages chat via port longue durée
 * - Appel API LLM en streaming (OpenAI-compatible)
 * - Relay des tokens vers le panel
 * - Stockage de l'historique des conversations
 * ============================================================
 */

import { PORTS } from "@shared/messages";
import type { ChatRequest, StreamMessage } from "@shared/messages";
import type { ChatMessage, PageContent } from "@shared/types";
import { getSettings, getConversation, saveConversation } from "@shared/storage";

// --- Ouvre le Side Panel au clic sur l'icône ---
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// --- Écoute les connexions port pour le streaming ---
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== PORTS.CHAT_STREAM) return;

  port.onMessage.addListener(async (msg: ChatRequest) => {
    if (msg.type !== "chat") return;

    try {
      // 1. Récupérer les paramètres utilisateur (clé API, modèle)
      const settings = await getSettings();
      if (!settings.apiKey) {
        sendError(port, "Clé API manquante. Configurez-la dans les options.");
        return;
      }

      // 2. Récupérer le contenu de la page via le content script
      const pageContent = await getPageContent(msg.tabId);

      // 3. Charger l'historique de conversation existant
      const conversation = await getConversation(msg.tabId);
      const history: ChatMessage[] = conversation?.messages || [];

      // 4. Ajouter le message utilisateur à l'historique
      history.push({ role: "user", content: msg.content });

      // 5. Construire les messages pour l'API LLM
      const apiMessages = buildPrompt(pageContent, history, settings.language);

      // 6. Appeler l'API en streaming et relayer les tokens
      const assistantContent = await streamLLMResponse(
        settings.apiKey,
        settings.model,
        apiMessages,
        port
      );

      // 7. Sauvegarder la conversation complète
      history.push({ role: "assistant", content: assistantContent });
      await saveConversation({
        id: conversation?.id || crypto.randomUUID(),
        tabId: msg.tabId,
        messages: history,
        createdAt: conversation?.createdAt || Date.now(),
      });

      // 8. Signaler la fin du streaming
      sendMessage(port, { type: "done" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      sendError(port, message);
    }
  });
});

// --- Récupère le contenu de la page via le content script ---
async function getPageContent(tabId: number): Promise<PageContent> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: "get_page_content" });
    return response as PageContent;
  } catch {
    // Si le content script n'est pas injecté, retourner un contenu vide
    return { title: "", url: "", content: "", selectedText: "" };
  }
}

// --- Construit le prompt système + historique pour l'API ---
function buildPrompt(
  page: PageContent,
  history: ChatMessage[],
  language: string
): Array<{ role: string; content: string }> {
  const lang = language === "fr" ? "français" : "English";

  // Prompt système avec le contexte de la page
  const systemPrompt = `Tu es un assistant IA intégré dans une extension Chrome. Tu réponds aux questions de l'utilisateur en te basant sur le contenu de la page web qu'il consulte.

RÈGLES :
- Réponds en ${lang}
- Base-toi principalement sur le contenu de la page fourni ci-dessous
- Si l'information n'est pas dans la page, dis-le clairement
- Sois concis et précis

--- PAGE CONSULTÉE ---
Titre : ${page.title}
URL : ${page.url}
${page.selectedText ? `\nTEXTE SÉLECTIONNÉ PAR L'UTILISATEUR :\n${page.selectedText}\n` : ""}
CONTENU :
${page.content || "(Aucun contenu extrait)"}
--- FIN DE LA PAGE ---`;

  return [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];
}

// --- Appelle l'API LLM en streaming (compatible OpenAI) ---
async function streamLLMResponse(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  port: chrome.runtime.Port
): Promise<string> {
  // Déterminer l'URL de l'API selon le modèle
  const isClaudeModel = model.startsWith("claude");
  const url = isClaudeModel
    ? "https://api.anthropic.com/v1/messages"
    : "https://api.openai.com/v1/chat/completions";

  // Construire la requête selon le provider
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  let body: string;

  if (isClaudeModel) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
    body = JSON.stringify({
      model,
      max_tokens: 1024,
      system: messages[0].content,
      messages: messages.slice(1),
      stream: true,
    });
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
    body = JSON.stringify({ model, messages, stream: true });
  }

  const response = await fetch(url, { method: "POST", headers, body });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
  }

  // Lire le stream SSE et relayer chaque token
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // Garder la dernière ligne incomplète dans le buffer
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        // Extraire le token selon le provider
        const token = isClaudeModel
          ? parsed.delta?.text || ""
          : parsed.choices?.[0]?.delta?.content || "";

        if (token) {
          fullContent += token;
          sendMessage(port, { type: "token", content: token });
        }
      } catch {
        // Ignorer les lignes JSON invalides
      }
    }
  }

  return fullContent;
}

// --- Helpers pour envoyer des messages via le port ---
function sendMessage(port: chrome.runtime.Port, msg: StreamMessage) {
  try {
    port.postMessage(msg);
  } catch {
    // Port déconnecté, ignorer silencieusement
  }
}

function sendError(port: chrome.runtime.Port, message: string) {
  sendMessage(port, { type: "error", message });
}
