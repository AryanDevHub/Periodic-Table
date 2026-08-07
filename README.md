# Quarx — Interactive Periodic Table & Chemistry Learning Platform

Quarx is a full-stack, gamified periodic table built to make learning chemistry interactive rather than static. It combines a real MongoDB-backed element database with original chemistry tools — including a linear-algebra-based equation balancer and a rule-driven reaction predictor — wrapped in a playful, anonymous-first learning experience.

**Live demo:** _[https://interactive-periodic-table-yt20.onrender.com/]_

---

## Why this exists

Most periodic table websites are reference tables — you look up an element and leave. Quarx is built around the idea that chemistry is better *learned by doing*: guessing what happens when two elements react, building an atom particle by particle, or balancing an equation you typed yourself teaches more than reading a static data sheet.

The project is designed to work fully anonymously — no login is required for any game, quiz, or tool. Progress (XP, streaks) is tracked locally per-device and only synced to an account if the user chooses to sign in, keeping the barrier to entry as low as possible.

---

## Features

### 🧪 Core periodic table
- All 118 elements with full atomic, physical, and classification data
- Animated, searchable, filterable interactive grid
- Category legend with click-to-highlight
- Per-element detail panel including an auto-generated **"Why is it here?"** explainer describing why each element occupies its position on the table
- Dark/light theming

### ⚗️ Equation Balancer
Type any unbalanced chemical equation (e.g. `Fe + O2 -> Fe2O3`) and get the correctly balanced form instantly.

Implemented from scratch using:
- A recursive-descent parser for chemical formulas (handles nested parentheses, e.g. `Ca(OH)2`)
- Exact fraction arithmetic (no floating-point rounding errors)
- Gaussian elimination over the null space of the element-count matrix to solve for the smallest positive integer coefficients

### 🔬 Reaction Lab
Pick any two elements and see what happens:
- **Known reactions** — a curated table of real, well-documented reactions with product, formula, and a short explanation
- **Rule-based prediction** — for pairs not in the curated table, simple chemistry rules (noble gas inertness, metal-metal alloying, alkali/alkaline-earth-metal + halogen salt formation) predict a plausible outcome using each element's actual oxidation states
- **Graceful fallback** — pairs outside both categories return an honest "not in our database yet" rather than a fabricated answer

This intentionally does *not* attempt general reaction prediction for arbitrary compounds — that's an open research problem in cheminformatics, not something a lookup/rule hybrid should claim to solve.

### ⚛️ Build an Atom
Click to add protons, neutrons, and electrons and watch the atom update in real time — element identification, ion charge, isotope detection, and animated electron shells (Bohr model).

### 📊 Compare Mode
Select 2–3 elements and see every property side-by-side in a single table.

### 🎮 Quiz Engine
- Three difficulty tiers (Beginner / Intermediate / Advanced)
- A large, auto-generated question bank (symbol↔name, atomic number, electron configuration, electronegativity ordering) built programmatically from the element dataset, plus hand-curated conceptual questions
- No-repeat tracking per difficulty (stored locally), so questions don't repeat until the pool is exhausted
- XP + daily streak tracking, visible in the header, fully anonymous by default

### 👤 Optional Accounts
- JWT-based authentication
- Favorite elements, personal notes per element, profile picture upload (Cloudinary)
- Everything above works without an account — login only adds cross-device sync

---

## Tech Stack

**Frontend:** React 19, React Router 7, Vite, CSS Modules
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JWT, bcrypt
**File uploads:** Cloudinary
**Deployment:** Vercel (serverless) and Netlify (serverless functions) — both share a single Express app factory (`server/app.js`) to avoid duplicated route logic across environments

---

## Architecture notes

- **Single source of truth for the backend.** `server/app.js` exports one `createApp()` factory. The local dev server (`server/server.js`), the Vercel entry point (`api/index.cjs`), and the Netlify function (`netlify/functions/api.js`) each just wrap this factory differently for their runtime — routes and middleware are never duplicated.
- **Frontend fetches live data.** Element and scientist data is served from MongoDB via `/api/elements` and `/api/scientists` — there is no static JSON fallback in the frontend, so what you see is always what's actually seeded in the database.
- **Question bank is generated, not hand-written.** `server/generateQuestions.js` derives hundreds of quiz questions programmatically from the existing element dataset (symbol/name/number/electron-config/trend-ordering questions), supplemented by a small curated set for conceptual question types.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or Atlas)
- (Optional) Cloudinary credentials for profile picture uploads

### 1. Clone and install

```bash
git clone <your-repo-url>
cd interactive-periodic-table
npm install
cd server && npm install && cd ..
```

### 2. Environment variables

Create `server/.env`:

DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4000


### 3. Seed the database

```bash
npm run seed
npm run generate-questions
```

### 4. Run locally

In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## Project Structure

interactive-periodic-table/
├── api/ # Vercel serverless entry point
├── netlify/functions/ # Netlify serverless entry point
├── server/
│ ├── app.js # Shared Express app factory
│ ├── server.js # Local dev entry point
│ ├── generateQuestions.js # Programmatic quiz question generator
│ ├── models/ # Mongoose schemas
│ └── routes/ # Auth & user routes
└── src/
├── pages/ # Route-level pages (Compare, BuildAtom, Balancer, ReactionLab, etc.)
├── components/ # Reusable UI components
├── utils/chemistry/ # Formula parser, fraction math, equation balancer, reaction rules
├── utils/progress.js # Anonymous XP/streak tracking
└── data/reactions.js # Curated reaction table


---

## Roadmap

- [ ] Automated tests for the equation balancer and formula parser (pure logic, no mocking needed — high priority)
- [ ] CI pipeline (lint + test on push)
- [ ] Expand curated reaction table
- [ ] Classroom mode (teacher dashboard, class codes, no student email required)
- [ ] Rate limiting and stricter input validation on auth routes

---

## License

MIT