**Analysis Date:** 2026-08-07

## Structure Overview
The project follows a standard Vite + React directory layout. 

### Directory Layout
- `/` - Root directory containing build and dependency configurations (`package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`)
- `/src` - Contains all frontend source code
  - `/src/components` - Reusable UI components (Sidebar, Header, modals, etc.)
  - `/src/context` - React Context providers (contains `CRMContext.tsx` for global state)
  - `/src/pages` - Top-level page components corresponding to routes (Dashboard, Leads, Conversations, etc.)
  - `/src/types` - TypeScript type definitions (contains `index.ts` with domain models like `LeadStatus`)
- `/public` - (Implicit) Static assets
- `/.agents` - Contains GSD (Git. Ship. Done.) workflow files and custom agent rules (`AGENTS.md`)

### Key Entry Points
- `src/main.tsx` - The entry point for the React application, rendering `<App />` into the DOM.
- `src/App.tsx` - The main application component that sets up routing and wraps the app in context providers.
- `src/context/CRMContext.tsx` - The central hub for all state and mock data logic.

### Future Additions
- `/supabase/migrations` - Will contain SQL schema migrations for the database
- `src/services/` - Will contain API clients and Supabase initialization code

*Last refreshed codebase analysis: 2026-08-07*
<!-- refreshed: 2026-08-07 -->
