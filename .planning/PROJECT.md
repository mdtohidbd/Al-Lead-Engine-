# Skybridge CRM Backend Wiring

## What This Is
A Node.js/TypeScript backend for the existing Skybridge CRM React frontend. It will connect to Supabase for Postgres, Auth, and Realtime, replacing the current `localStorage` mock data implementation.

## Core Value
A robust, secure backend that correctly manages single-tenant data, integrates AI lead qualification via Claude/Gemini, and connects with the WhatsApp Cloud API.

## Requirements

### Validated
- ✓ Frontend React UI layout and components — existing
- ✓ Existing Context API structure (`CRMContext.tsx`) for global state consumption — existing

### Active
- [ ] Task 0: Reconcile `LeadStatus` enum globally
- [ ] Task 1: Setup Supabase project with RLS and specific table schema
- [ ] Task 2: Scaffold Node.js backend (Express/Fastify + TypeScript)
- [ ] Task 3: Supabase Auth integration (JWT verification in backend)
- [ ] Task 4: Core CRUD endpoints replacing mock functions
- [ ] Task 5: Secure Settings implementation (backend-only secrets)
- [ ] Task 6: WhatsApp webhook and AI reply engine
- [ ] Task 7: Rewire `CRMContext.tsx` to use real backend API
- [ ] Task 8: Supabase Realtime updates for conversations
- [ ] Task 9: Cleanup (remove GreenLead references, `.env.example`, etc.)

### Out of Scope
- Redesigning the frontend UI (must remain exactly as is) — explicitly requested to not touch `src/pages/` or `src/components/` layout.

## Context
- The app is currently 100% frontend relying on `localStorage`.
- Required Tech Stack: Node.js, Express/Fastify, TypeScript, `zod`, Supabase, Anthropic Claude API, WhatsApp Cloud API.
- Single-tenant architecture: One Supabase project per client.

## Constraints
- **Security**: Backend-only secrets must never be sent to the frontend.
- **Frontend boundaries**: Do not alter `src/pages/` or `src/components/`.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Supabase Auth | Removes need to build custom JWT/password hashing. | — Pending |
| AI provider swap | Must support Claude or Gemini via env var `AI_PROVIDER`. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-07 after initialization*
