# IncubVent — Car Dealership Inventory Frontend

A single-page React application for the Car Dealership Inventory System kata.
Built with **React 18 + Vite + Tailwind CSS + React Router**.

## Testing (TDD)

Tests live in the **`tests/`** folder, mirroring `src/`'s structure, and use
**Vitest + React Testing Library**. The suite covers the pieces that carry
real logic — the API client (auth, CRUD, response normalization, error
handling), the vehicle card's purchase/admin behavior, the search/filter
bar, the auth state machine, and a full Dashboard integration flow (list →
purchase → admin add → empty state).

```bash
npm test              # run once (used for the test report / CI)
npm run test:watch    # watch mode while developing — the red/green loop
npm run test:coverage # run with coverage, output in coverage/index.html
```

```
tests/
  setup.js                    # jsdom + testing-library setup
  api/client.test.js          # auth, CRUD, normalization, network errors
  components/VehicleCard.test.jsx
  components/SearchBar.test.jsx
  context/AuthContext.test.jsx
  pages/Dashboard.test.jsx    # integration: list, purchase, admin add, empty state
  TEST_REPORT.txt             # latest `npm run test:coverage` output
```

Current status: **41/41 tests passing**, with 96% statement coverage on
`src/api/client.js` and 85–99% on the components/context that hold
meaningful branching logic (full breakdown in `tests/TEST_REPORT.txt` or
`coverage/index.html` after running `npm run test:coverage`).

When extending the app, follow the same red-green-refactor loop as the
backend: write a failing test for the new behavior in the matching `tests/`
subfolder, make it pass with the smallest change, then refactor.

## Design

The visual identity is built around the idea of a dealership showroom: an
asphalt-dark shell, a "turn-signal amber" accent, and vehicle listings styled
like Monroney window stickers (perforated top edge, stock number tag, mono
price digits, a "SOLD OUT" stamp when quantity hits zero). Fonts are Oswald
(display/signage), Inter (body), and JetBrains Mono (prices/stock numbers).

## Features

- Email/password **register** and **login**, JWT stored client-side and
  attached to protected requests automatically.
- **Dashboard** grid of all vehicles with live search (make/model) and
  filters (category, min/max price).
- **Purchase** button on every card, disabled automatically once quantity
  reaches zero.
- **Admin-only** controls (shown only when the logged-in user's role is
  admin): add vehicle, edit vehicle, delete vehicle, restock vehicle.
- Toast notifications for success/error feedback, loading skeletons, and an
  empty state for no results.
- Fully responsive (mobile → desktop) and keyboard-accessible (visible focus
  rings, `Escape` closes modals, reduced-motion respected).

## Connecting to your backend

All API calls live in **`src/api/client.js`** — this is the single file to
edit if your backend's routes or response shapes differ from the
assumptions below.

1. Copy the env file and point it at your backend:

   ```bash
   cp .env.example .env
   # edit .env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. Assumed endpoint contract (from the kata spec):

   | Method | Path | Auth | Body |
   |---|---|---|---|
   | POST | `/auth/register` | – | `{ name, email, password }` |
   | POST | `/auth/login` | – | `{ email, password }` |
   | GET | `/vehicles` | ✓ | – |
   | GET | `/vehicles/search` | ✓ | query: `make, model, category, minPrice, maxPrice` |
   | POST | `/vehicles` | ✓ admin | `{ make, model, category, price, quantity, year? }` |
   | PUT | `/vehicles/:id` | ✓ | partial vehicle fields |
   | DELETE | `/vehicles/:id` | ✓ admin | – |
   | POST | `/vehicles/:id/purchase` | ✓ | `{ quantity }` |
   | POST | `/vehicles/:id/restock` | ✓ admin | `{ quantity }` |

3. Assumed response shapes (the client already normalizes minor variants —
   see `normalizeUser` / `normalizeVehicle` / `normalizeList` in
   `client.js`):
   - Auth responses: `{ token, user: { id, name, email, role } }`.
     `role` can be `"admin" | "user"`, or an `isAdmin: boolean` — both are
     checked automatically.
   - Vehicle list responses: a bare array **or** `{ vehicles: [...] }` /
     `{ data: [...] }` — both are handled.
   - Vehicle object: `{ id, make, model, category, price, quantity, year? }`
     (also accepts `_id` and `stock` as aliases for `id`/`quantity`).

   If your backend's shapes differ from these, adjust the `normalize*`
   helpers in `src/api/client.js` — no other file needs to change.

## Running locally

```bash
npm install
npm run dev       # starts on http://localhost:3000
```

Make sure your backend is running and CORS-enabled for the frontend's
origin, or requests will fail with a network error.

## Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  api/client.js           # all backend communication + response normalization
  context/AuthContext.jsx # session state (user, login/register/logout)
  context/ToastContext.jsx# toast notifications
  components/             # Navbar, VehicleCard, SearchBar, modals, AuthLayout
  pages/                  # Login, Register, Dashboard
  App.jsx                 # routing + route guards
```

## My AI Usage

_Fill this section in for your submission — describe which AI tools you
used, how you used them (e.g. "generated the initial component
scaffolding, then hand-edited the state management and API contract"),
and your reflection on how it affected your workflow. This frontend was
generated with Claude; if you use it as a starting point, be transparent
about that here and add co-author trailers on the relevant commits per the
kata's AI usage policy._
