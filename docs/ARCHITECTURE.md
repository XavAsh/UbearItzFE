## Architecture Overview

### Tech Stack
- Framework: `Next.js 16` App Router with React Server Components
- Language: TypeScript with strict domain types under `types/`
- State management: `zustand` stores persisted to localStorage
- Testing: Vitest for unit tests, Playwright for E2E flows

### Directory Layout
- `app/`: Route handlers (pages, layouts, middleware) split by audience (`/restaurants`, `/dishes`, `/login`, `/admin`, etc.). Client components opt in via `"use client"`.
- `components/`: Reusable UI + feature components (auth forms, layout, restaurant cards).
- `services/`: Data-access layer. `services/api/*` wrap mock data queries and handle domain typing. `services/http.ts` centralises latency/error simulation.
- `stores/`: Zustand stores for auth, restaurants, cart (and stubs for orders). Stores act as the client cache and expose typed selectors/getters.
- `lib/`: Cross-cutting helpers (i18n provider, seo helpers, pwa config, utils).
- `locales/`: JSON dictionaries for FR/EN translations used by the i18n provider.
- `public/`: Static assets (images, icons, manifest placeholder).
- `__tests__/`: Unit and Playwright suites mirroring the main flows (auth/cart/orders/restaurant browsing).

### Data Flow
1. UI components trigger store actions (e.g. `useRestaurantStore.loadAll`).
2. Stores call typed service functions (e.g. `getRestaurants`) which fetch from `services/mock/mock-data.json` via `simulateNetwork`.
3. Responses populate store state; derived getters (`itemCount`, `totalPrice`, etc.) keep rendering logic simple.
4. Middleware inspects cookies for auth + locale and reroutes protected paths.

### Pending Improvements
- Move restaurant list/detail to server components with SSR/ISR.
- Expand order store/services to remove localStorage coupling.
- Introduce proper SEO helpers (`lib/seo.ts`), manifest + service worker, and CI pipeline as captured in the rubric plan.

This document should evolve alongside those upgrades so new contributors immediately grasp how routes, services, and stores interact.

