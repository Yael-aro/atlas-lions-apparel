# Copilot / AI Agent Instructions for atlas-lions-apparel

Purpose: give an AI coding agent the minimal, high-value knowledge to be productive in this repo.

- Project type: Vite + React (TypeScript) single-page app using `HashRouter` and deployed to GitHub Pages.
- Source root: `src/` — primary areas of interest: `src/pages/`, `src/components/`, `src/contexts/`, `src/lib/`, `src/hooks/`, `src/data/`.

Key commands
- `npm run dev` : start Vite dev server.
- `npm run build` : produce production build into `dist`.
- `npm run build:dev` : dev-mode build (same but development mode).
- `npm run preview` : preview a local production build.
- `npm run deploy` : runs `predeploy` then `gh-pages -d dist` — used to publish to GitHub Pages.

Important architecture notes
- Routing: app uses `HashRouter` in `src/App.tsx`. Pages map to files under `src/pages/` (e.g. `Panier.tsx` => `/panier`). Keep `HashRouter` unless changing deploy target or pages behavior.
- Global state: `CartProvider` (in `src/contexts/CartContext.tsx`) wraps the app; it persists the cart to `localStorage` under the key `cart`. Be careful when changing the cart shape — migrations may be needed.
- Data & products: `src/data/products.ts` contains product fixtures used by pages/components. Use it as the authoritative local product source.
- API / backend: Supabase is used. The client is created in `src/lib/supabase.ts`. Note: a (committed) supabase anon key and url are in that file — treat this as sensitive and prefer environment variables (`import.meta.env`) for production changes.
- Query/cache: `@tanstack/react-query` is initialized at app root (`QueryClientProvider` in `src/App.tsx`) — use React Query for server state and caching patterns.
- UI system: `src/components/ui/` contains small Radix-based and shared UI primitives (button, tooltip, toast, sheet, etc.). Follow existing component names and props when adding new UI controls.

Project-specific conventions
- Module alias: `@/*` resolves to `./src/*` (see `tsconfig.json`). Use `@/` imports in new code (e.g. `import { useCart } from '@/contexts/CartContext'`).
- File locations: route components live under `src/pages/`. Reusable UI primitives go under `src/components/ui/`. Larger components (page-specific) live in `src/components/` root.
- TypeScript: project is not strict in all settings (`noImplicitAny: false`) — still add types for public exports, especially for contexts and component props.
- Storage: `CartContext` serializes to `localStorage`. Prefer id-based updates and keep `CartItem` shape stable (see `CartContext.tsx` for fields like `size` and `customizable`).

Security & secrets
- `src/lib/supabase.ts` currently contains a supabase URL and anon key. Do not commit production secrets. For changes that require new keys or services, replace with `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` and update `vite`/deployment environment accordingly.

Examples (common tasks)
- Add a new page route:
  1. Create `src/pages/NewPage.tsx` exporting a React component.
  2. Add a `Route` for it in `src/App.tsx` (inside the `HashRouter`/`Routes`). Use `HashRouter` behaviour when testing on GitHub Pages.
- Use Cart context:
  - `import { useCart } from '@/contexts/CartContext'`
  - `const { addToCart, items } = useCart();`
- Use module alias:
  - `import Button from '@/components/ui/button'`

Developer workflows & debugging
- Lint: `npm run lint` (ESLint) — there is no automated test suite in the repo.
- Build + deploy: `npm run deploy` builds and then uses `gh-pages` to publish `dist/`. Because the app uses `HashRouter`, GitHub Pages hosting works without extra server configuration.
- Local debugging: open the browser at the port shown by Vite after `npm run dev`. For production-like testing, run `npm run build` and `npm run preview`.

What an agent should watch for
- Do not leak or rotate secrets in committed code; if you find API keys in code (like `src/lib/supabase.ts`), flag them and suggest moving to env variables.
- Preserve `HashRouter` behavior unless the deploy target changes — routing depends on it.
- Keep `CartContext` localStorage key `cart` stable or provide a migration path if you change shape.

Missing or non-existent patterns
- There are no unit or integration tests in the repo. If adding tests, prefer lightweight component tests and small integration tests for context logic.
- No CI or GitHub Actions were found; add CI only if requested.

Files to inspect when making changes
- `src/App.tsx` — routing, providers, QueryClient, CartProvider.
- `src/contexts/CartContext.tsx` — cart behavior & localStorage.
- `src/lib/supabase.ts` — Supabase client and keys.
- `src/components/ui/` — shared UI primitives and patterns.
- `src/pages/` — page components for routing.
- `package.json` — scripts and deploy steps.

If something is ambiguous, ask the maintainer these quick questions:
1. Should supabase keys remain in-source or be migrated to env vars? (recommended: env vars)
2. Are we preserving `HashRouter` for GitHub Pages, or migrating to a different hosting setup?
3. Should an agent add automated tests or CI in this PR, or keep changes focused?

End of instructions.
