
# 🤖 Chrome AI Assistant

Extension Chrome qui ouvre un panneau de chat latéral (Side Panel) permettant d'interroger une IA sur le contenu de la page courante : questions, résumés, traduction, assistance.

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en mode développement (hot reload)
npm run dev

# 3. Charger l'extension dans Chrome
#    → chrome://extensions → Mode développeur → Charger l'extension non empaquetée
#    → Sélectionner le dossier dist/

# 4. Lancer les tests
npm run test
```

## Structure du projet

```
chrome-ai-assistant/
├── manifest.json              # Config extension Chrome (MV3)
├── vite.config.ts             # Bundler + plugin CRXJS
├── package.json               # Dépendances et scripts
├── tsconfig.json              # Config TypeScript
├── tailwind.config.js         # Config Tailwind CSS
├── postcss.config.js          # Pipeline PostCSS
├── src/
│   ├── background/index.ts    # Service Worker (appels API, logique)
│   ├── content/index.ts       # Content Script (extraction DOM)
│   ├── panel/                 # Side Panel (interface chat React)
│   │   ├── components/        # ChatMessage, ChatInput, QuickActions
│   │   ├── hooks/             # useChat, usePageContent
│   │   └── ...
│   ├── options/               # Page de paramètres
│   ├── shared/                # Types, messages, storage (partagés)
│   └── assets/icons/          # Icônes 16/48/128px
└── tests/                     # Tests unitaires (Vitest)
```

## Répartition des tâches

| Personne | Périmètre |
|----------|-----------|
| **A** | Frontend — Side Panel, composants React, page options, UI/UX |
| **B** | Backend — Service Worker, appels API LLM, streaming, stockage |
| **C** | Intégration — Content Script, extraction DOM, tests, publication |

## Configuration

1. Ouvrir les options de l'extension (clic droit sur l'icône → Options)
2. Entrer votre clé API OpenAI
3. Choisir le modèle et la langue

## Technologies

- **React 18** + TypeScript — UI du Side Panel
- **Tailwind CSS** — Styling
- **Vite + CRXJS** — Build et hot reload
- **Chrome Side Panel API** — Panneau latéral persistant
- **OpenAI API** — Modèle de langage (streaming)
- **Vitest** — Tests unitaires

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev avec hot reload |
| `npm run build` | Build production dans `dist/` |
| `npm run test` | Tests unitaires |
