# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Project Overview

**最強の栄養管理師AI**（Asken Clone）is a meal-logging and nutrition-analysis web
application. A user records a meal (text description and/or photo), an AI service
(Dify) estimates the nutrition (calories + PFC: protein/fat/carbohydrates +
salt), and the dashboard shows the day's running totals against a calorie goal.

- The UI is **entirely in Japanese**. Keep all user-facing strings in Japanese
  and match the existing tone (friendly, motivational, fitness-coach voice).
- The frontend is a **static site** — plain HTML/CSS/JavaScript (ES modules),
  no build step, no framework, no bundler.
- There is **no test suite** and no linter configured for the frontend.

## Repository Layout

```
.
├── index.html                 # Dashboard page (PFC totals, meal list, filters)
├── log.html                   # Meal-logging page (form + AI analysis result)
├── scripts/
│   ├── main.js                # Dashboard logic (reads LocalStorage, renders totals)
│   ├── log.js                 # Logging-page logic (form, preview, save)
│   ├── dify.js                # Meal-analysis service (calls Firebase callable fns)
│   ├── firebase.js            # Firebase init + httpsCallable refs + helpers
│   ├── organize_desktop.sh    # Unrelated personal utility script — ignore
│   ├── tiktok_*.md            # Unrelated personal content — ignore
├── styles/
│   ├── index.css              # Layout/component styles
│   └── theme.css              # CSS custom properties (colors, fonts, radii)
├── data/
│   └── foods.json             # Static reference food/nutrition table (not yet wired in)
├── functions/                 # Firebase Cloud Functions (Node 18) — the active backend
│   ├── index.js               # analyzeMeal + uploadMealPhoto callable functions
│   └── package.json
├── netlify/functions/
│   └── analyze-meal.js        # Alternative Netlify-Function backend (NOT wired to the UI)
├── firebase.json, .firebaserc, firestore.rules, storage.rules, firestore.indexes.json
├── netlify.toml, _redirects   # Netlify static-hosting + SPA redirect config
└── *.md                       # Setup/requirements/status docs (Japanese)
```

> Note: The README's file tree references an `asken_clone/` subfolder, but the
> app now lives at the **repository root**. Treat the root as the publish
> directory (`netlify.toml` sets `publish = "."`).

## Architecture & Data Flow

1. **Logging** (`log.html` → `log.js`): user picks a meal type, optionally a
   photo, and a text description, then submits. `log.js` calls
   `analyzeMeal(photo, text, mealType)` from `dify.js`.
2. **Analysis** (`dify.js` → `firebase.js`): if a photo exists it is converted to
   Base64 and uploaded via the `uploadMealPhoto` callable; then `analyzeMeal` (the
   `analyzeMeal` callable in `functions/index.js`) is invoked. That function fetches
   the image from Firebase Storage, calls the **Dify API**, parses the response, and
   optionally writes to Firestore `meal_logs`.
3. **Fallback**: if the Firebase call fails (or no config), `dify.js` returns a
   **mock response** (`getMockResponse`) so the UI keeps working during local dev.
4. **Persistence**: on "記録を確定", `log.js` saves the analysis to
   **LocalStorage** under the key `mealLogs`, structured as
   `{ "YYYY-MM-DD": [ { menu, calories, pfc:{p,f,c}, salt, advice, mealType, timestamp } ] }`.
   Firestore persistence exists in the Cloud Function but the dashboard reads
   **only** from LocalStorage.
5. **Dashboard** (`index.html` → `main.js`): reads today's logs from LocalStorage,
   sums calories/PFC, renders the progress bar (goal `CALORIE_GOAL = 2200`), and
   the filterable meal list.

### Two backends — important
There are two server-side implementations of the same idea:
- `functions/index.js` — **Firebase Cloud Functions**. This is what the frontend
  actually calls (via `httpsCallable` in `firebase.js`).
- `netlify/functions/analyze-meal.js` — a standalone Netlify Function. It is **not
  referenced by the frontend** today; treat it as an alternative deployment path.

If you change the analysis request/response shape, keep both in sync (or note
explicitly which one is being deprecated). The shared response shape is:
`{ menu, calories, pfc:{p,f,c}, salt, advice, raw_output }`.

## Conventions

- **Vanilla JS, ES modules.** Scripts are loaded with `<script type="module">`.
  Keep DOM lookups null-guarded (`if (el)`), as the existing code does.
- **No framework / no build.** Don't introduce React, bundlers, or a package
  manager for the frontend without explicit instruction. Frontend imports
  Firebase from the gstatic CDN (`firebasejs/10.7.1`).
- **Comments and UI text are Japanese**; code identifiers are English. Match this.
- **Secrets/config are placeholders.** `scripts/firebase.js` (`firebaseConfig`)
  and `.firebaserc` contain `YOUR_PROJECT_ID` / `YOUR_API_KEY` etc. Do not commit
  real keys. The Dify key lives in Cloud Functions config / Netlify env vars
  (`DIFY_API_KEY`, `DIFY_ENDPOINT`), never in frontend code.
- **Security rules are wide open** (`allow read/write: if true`). This is known
  tech debt — see `PROJECT_STATUS.md`. Don't tighten them silently if it would
  break the (currently auth-less) app, but flag it.

## Running & Developing Locally

Static frontend (most common task):
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
The app works fully offline using the LocalStorage + mock-analysis fallback;
Firebase/Dify are only needed for real AI analysis.

Firebase Functions (from `functions/`):
```bash
npm install
npm run serve     # firebase emulators:start --only functions
npm run deploy    # firebase deploy --only functions
npm run logs
```

## Deployment

- **Frontend → Netlify** (static): publish dir `.`, no build command. SPA-style
  redirect to `index.html` via `_redirects`. Security headers in `netlify.toml`.
- **Backend → Firebase**: Functions + Storage + Firestore configured in
  `firebase.json`. Set `DIFY_API_KEY` / `DIFY_ENDPOINT` via
  `firebase functions:config:set` before deploying.
- See `DEPLOY.md`, `FIREBASE_SETUP.md`, and `DIFY_*` docs for step-by-step setup.

## Git Workflow

- Develop on the assigned feature branch; commit with clear messages.
- Push with `git push -u origin <branch>`, then open a **draft PR** if none exists.
- Don't push to `main` without explicit permission.

## Known Gaps (see PROJECT_STATUS.md)

- No authentication; security rules are permissive.
- No edit/delete of logged meals; no historical (past-day) view in the UI.
- Real Dify/Firebase connection is untested in places (mock fallback masks this).
- `data/foods.json` is reference data not yet integrated into the UI.
