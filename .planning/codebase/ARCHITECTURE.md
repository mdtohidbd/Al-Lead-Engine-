**Analysis Date:** 2026-08-07

## Architecture Overview
The current architecture is a monolithic Single Page Application (SPA) built with React. The state management is localized, and the application does not yet have a backend server.

### Current Architecture Layers
1. **Presentation Layer (`src/pages`, `src/components`)**
   - React components styled with Tailwind CSS
   - Consumes global state via Context API hooks (`useCRM`)

2. **State Management & Data Access Layer (`src/context/CRMContext.tsx`)**
   - Centralized state provider using React Context
   - Currently acts as an in-memory database and handles CRUD operations directly using `localStorage`
   - Contains all mock data and business logic for the frontend

### Future Architecture (Planned)
The architecture will transition to a client-server model:

1. **Frontend (React)**
   - Will remain mostly unchanged visually
   - `src/context/CRMContext.tsx` will be refactored to consume data from the backend instead of `localStorage`
   - A new `src/services/` layer will be introduced to handle API calls (`api.ts`) and Supabase client initialization (`supabaseClient.ts`)

2. **Backend (Node.js + Express/Fastify)**
   - Will serve as the API gateway and handle business logic (e.g., AI lead scoring, WhatsApp webhook processing)
   - Will validate requests using `zod`
   - Will interact with Supabase using `@supabase/supabase-js` (service role key)

3. **Database (Supabase)**
   - Postgres database for structured data storage
   - Supabase Auth for user management
   - Supabase Realtime for live updates on conversations

*Last refreshed codebase analysis: 2026-08-07*
<!-- refreshed: 2026-08-07 -->
