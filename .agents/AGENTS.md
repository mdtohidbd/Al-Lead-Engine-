# Skybridge — AI WhatsApp Lead Qualification Platform Rules

These rules apply specifically to the Al-Lead-Verify-CRM (Skybridge) workspace and dictate the agent's behavior for all tasks in this repository.

## 1. Single-Tenant Architecture & No Hardcoding
- **Single-tenant:** Each deployment serves exactly one company. There is no shared multi-tenant SaaS architecture (no `company_id` column scattered through tables).
- **NEVER hardcode client-specific values:** Business names, industry, Meta credentials, AI system prompt inputs, qualification questions, hot-lead thresholds, etc., must **always** live in a single `company_config` table/row.

## 2. Frontend Boundaries
- **DO NOT redesign the frontend:** The visual and component structure (`src/pages/`, `src/components/`) is approved and already built. Do not alter it unless explicitly requested.
- **Backend Wiring:** When connecting the frontend to the real backend, only modify the data layer (e.g., `src/context/CRMContext.tsx`) and create API services (e.g., `src/services/api.ts`).

## 3. Strict Security Rules
- **Backend-Only Secrets:** Claude API keys and Meta WhatsApp access tokens must **never** be sent to, stored in, or editable from the browser. 
- **Settings UI:** The frontend Settings UI must never expose raw secrets (use masked confirmation only and separate write-only endpoints).
- **Authentication:** Use Supabase Auth for all signup, login, and session handling instead of building custom JWT/password hashing.

## 4. Automation & Feature Flags
- Every automated action (AI replies, scheduled sends, bulk sends, event triggers) **must** check a feature-flag kill switch before executing so the platform can be paused without redeploying.

## 5. Development Workflow
- Work in small, verifiable phases. 
- Write a test or a curl-based check for each phase before moving to the next phase.

## 6. Tech Stack & Data Model
- **Stack Constraint:** Use React + TypeScript + Tailwind (Frontend), Node.js with Express/Fastify + TypeScript (Backend), and Supabase (Postgres, Auth, Realtime).
- **Real-time Updates:** Use Supabase Realtime (Postgres change subscriptions) instead of custom polling or SSE for frontend updates.
- **Scheduled/Bulk Jobs:** Run background jobs inside the Node server (e.g., node-cron) instead of Supabase Edge Functions to avoid execution time limits.
- **Canonical Lead Statuses:** Use the agreed-upon lead statuses consistently across the stack: `New`, `Qualifying`, `Warm`, `Hot`, `Qualified`, `Cold`, `Closed`.
