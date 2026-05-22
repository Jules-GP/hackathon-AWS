# Architecture — Extension Chrome : Assistant IA contextuel

## 1. Vue d'ensemble

Extension Chrome qui ouvre un panneau de chat latéral permettant à l'utilisateur d'interroger une IA sur le contenu de la page courante (questions, résumés, assistance).

```
┌─────────────────────────────────────────────────┐
│  Page web (DOM)                                  │
│                                                  │
│  ┌──────────────────┐    ┌────────────────────┐ │
│  │  Content Script   │◄──►│  Side Panel (UI)   │ │
│  │  (extraction DOM) │    │  (chat interface)  │ │
│  └────────┬─────────┘    └────────┬───────────┘ │
│           │                        │             │
└───────────┼────────────────────────┼─────────────┘
            │                        │
            ▼                        ▼
     ┌─────────────────────────────────────┐
     │         Service Worker (background) │
     │  - Gestion état / sessions          │
     │  - Appels API LLM                   │
     └──────────────────┬──────────────────┘
                        │
                        ▼
              ┌───────────────────┐
              │   API LLM (cloud) │
              │  OpenAI / Claude  │
              └───────────────────┘
```

---

## 2. Stack technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| UI (Side Panel) | React + TypeScript | Composants réutilisables, typage fort |
| Styling | Tailwind CSS | Rapide, léger, pas de conflit CSS avec la page hôte |
| Build | Vite + CRXJS | Hot reload pour extensions Chrome, build rapide |
| Content Script | TypeScript vanilla | Léger, pas de framework nécessaire pour l'extraction DOM |
| Background | Service Worker (MV3) | Obligatoire pour Manifest V3 |
| API LLM | OpenAI GPT-4o-mini | Bon ratio coût/qualité, streaming supporté |
| Stockage | chrome.storage.local | Historique conversations, clé API utilisateur |

---

## 3. Composants détaillés

### 3.1 Content Script (`content.ts`)
- Extrait le contenu textuel de la page (innerText, meta, title)
- Nettoie le HTML (suppression nav, footer, ads)
- Expose le contenu via `chrome.runtime.onMessage`
- Sélection de texte : détecte la sélection utilisateur pour contexte ciblé

### 3.2 Side Panel (`panel/`)
- Interface chat (liste de messages, input, boutons d'action rapide)
- Boutons prédéfinis : "Résumer la page", "Expliquer", "Traduire"
- Affichage streaming (token par token)
- Gestion historique local par onglet

### 3.3 Service Worker (`background.ts`)
- Reçoit les messages du panel et du content script
- Construit le prompt système avec le contexte de la page
- Appelle l'API LLM (streaming via fetch + ReadableStream)
- Gère le rate limiting et les erreurs API
- Stocke/récupère l'historique via `chrome.storage.local`

### 3.4 Page d'options (`options/`)
- Saisie et validation de la clé API
- Choix du modèle (GPT-4o-mini, GPT-4o, Claude Sonnet)
- Paramètres : langue de réponse, longueur max du contexte

---

## 4. Flux de données

```
1. Utilisateur clique sur l'icône → Side Panel s'ouvre
2. Panel envoie "get_page_content" → Content Script
3. Content Script extrait le DOM → renvoie le texte nettoyé
4. Utilisateur tape une question dans le chat
5. Panel envoie {question, contexte_page, historique} → Service Worker
6. Service Worker construit le prompt et appelle l'API LLM (stream)
7. Tokens reçus en streaming → relayés au Panel via port
8. Panel affiche la réponse progressivement
```

---

## 5. Structure du projet

```
chrome-ai-assistant/
├── manifest.json
├── vite.config.ts
├── package.json
├── src/
│   ├── background/
│   │   └── index.ts          # Service Worker
│   ├── content/
│   │   └── index.ts          # Content Script
│   ├── panel/
│   │   ├── App.tsx           # Composant racine
│   │   ├── components/
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── usePageContent.ts
│   │   ├── index.html
│   │   └── main.tsx
│   ├── options/
│   │   ├── App.tsx
│   │   ├── index.html
│   │   └── main.tsx
│   ├── shared/
│   │   ├── types.ts          # Types partagés
│   │   ├── messages.ts       # Protocole de messages
│   │   └── storage.ts        # Helpers chrome.storage
│   └── assets/
│       └── icons/
├── tests/
└── README.md
```

---

## 6. Solutions envisagées et choix

| Décision | Option A (✅ retenue) | Option B (❌ écartée) | Raison |
|----------|----------------------|----------------------|--------|
| UI de chat | Side Panel API | Popup | Le panel reste ouvert pendant la navigation, meilleure UX |
| Extraction contenu | Content Script dédié | Injection depuis background | Plus fiable, accès direct au DOM |
| Communication | chrome.runtime messages + ports | Stockage partagé polling | Temps réel, streaming possible |
| Appel API | Depuis le Service Worker | Depuis le panel | Centralise la logique, protège la clé API |
| Streaming | ReadableStream + ports longue durée | Attente réponse complète | UX fluide, feedback immédiat |
| Stockage clé API | chrome.storage.local | Variable en mémoire | Persiste entre sessions, jamais exposée au DOM |
| Framework UI | React | Vanilla / Svelte | Écosystème riche, connu de l'équipe |
| Build | Vite + CRXJS | Webpack | Config minimale pour extensions Chrome |

---

## 7. Répartition des tâches (3 personnes)

### Personne A — Frontend (Side Panel + Options)

| Sprint | Tâche | Livrable |
|--------|-------|----------|
| S1 | Setup projet (Vite + CRXJS + React + Tailwind) | Projet buildable, manifest.json fonctionnel |
| S1 | Scaffold Side Panel + page options | Pages vides qui s'ouvrent correctement |
| S2 | Composants chat (ChatMessage, ChatInput, QuickActions) | UI complète du chat |
| S2 | Affichage streaming (réception tokens progressifs) | Messages qui s'affichent en temps réel |
| S3 | Page options (saisie clé API, choix modèle) | Settings persistés dans chrome.storage |
| S3 | Historique conversations (affichage, suppression) | Liste de conversations navigable |
| S4 | Polish UI, responsive, animations, dark mode | Extension visuellement finie |

### Personne B — Backend / Service Worker + API

| Sprint | Tâche | Livrable |
|--------|-------|----------|
| S1 | Service Worker de base + système de messages | Messages transitent entre composants |
| S1 | Intégration API OpenAI (appel simple, non-streaming) | Réponse IA fonctionnelle |
| S2 | Streaming (ReadableStream → port → panel) | Tokens relayés en temps réel |
| S2 | Construction du prompt (system prompt + contexte page + historique) | Prompts optimisés |
| S3 | Gestion erreurs (rate limit, timeout, clé invalide) | Messages d'erreur clairs côté UI |
| S3 | Gestion stockage (historique, sessions par onglet) | Persistance complète |
| S4 | Support multi-modèles (OpenAI, Claude) | Switch de provider transparent |

### Personne C — Content Script + Intégration + Tests

| Sprint | Tâche | Livrable |
|--------|-------|----------|
| S1 | Content Script : extraction texte brut de la page | Texte nettoyé disponible |
| S1 | Nettoyage DOM (suppression bruit : nav, footer, scripts, pubs) | Contenu pertinent uniquement |
| S2 | Détection sélection texte utilisateur | Contexte ciblé envoyé au chat |
| S2 | Gestion pages dynamiques (SPA, mutation observer) | Contenu à jour même après navigation SPA |
| S3 | Tests unitaires (extraction, messages, stockage) | Couverture > 70% sur la logique métier |
| S3 | Tests E2E avec Puppeteer (scénario complet) | Scénario "ouvrir panel → poser question → réponse" |
| S4 | Documentation (README, guide d'installation, contribution) | Projet publiable |
| S4 | Packaging et publication Chrome Web Store | Extension soumise |

---

## 8. Planning (4 sprints d'1 semaine)

```
Semaine 1 ─ Fondations
  ✓ Projet initialisé, build fonctionnel
  ✓ Communication entre composants opérationnelle
  ✓ Premier appel API réussi (non-streaming)
  ✓ Extraction de contenu basique

Semaine 2 ─ Fonctionnalités core
  ✓ Chat complet avec streaming
  ✓ Contexte page injecté dans les prompts
  ✓ Sélection de texte fonctionnelle

Semaine 3 ─ Robustesse
  ✓ Gestion d'erreurs complète
  ✓ Historique persisté
  ✓ Page options fonctionnelle
  ✓ Tests

Semaine 4 ─ Finalisation
  ✓ Polish UI
  ✓ Multi-modèles
  ✓ Documentation
  ✓ Publication
```

---

## 9. Points d'attention

- **Sécurité** : la clé API ne doit jamais transiter par le content script (accessible au DOM). Toujours passer par le Service Worker.
- **Permissions** : demander `activeTab` (pas `<all_urls>`) pour limiter les permissions au strict nécessaire.
- **Taille du contexte** : tronquer le contenu de la page à ~4000 tokens pour rester dans les limites et maîtriser les coûts.
- **CSP** : le Side Panel a son propre contexte isolé, pas de conflit avec la CSP de la page hôte.
- **Manifest V3** : pas de `background.persistent`, utiliser uniquement des Service Workers.

---

## 10. Dépendances à installer

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "openai": "4.73.0"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "2.0.0-beta.28",
    "@types/chrome": "0.0.287",
    "@types/react": "18.3.12",
    "autoprefixer": "10.4.20",
    "postcss": "8.4.49",
    "tailwindcss": "3.4.15",
    "typescript": "5.6.3",
    "vite": "6.0.3",
    "vitest": "2.1.8",
    "puppeteer": "23.10.1"
  }
}
```
