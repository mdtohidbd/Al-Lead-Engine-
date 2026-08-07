# Agent Task List — Wire Skybridge Frontend to Real Backend (Node.js + Supabase)

**Context for the agent:** A React frontend already exists at `src/`. It currently runs entirely on local React state + `localStorage` with fake/mock data — no backend exists yet. Your job is to build a Node.js/TypeScript backend and wire the frontend to Supabase (Postgres + Auth + Realtime), without redesigning the existing UI. Do not touch `src/pages/` or `src/components/` layout — only `src/context/CRMContext.tsx` and a new `src/services/` layer change on the frontend. Work through these tasks in order, verifying each definition of done before moving on.

**Stack for this build:**
- Backend: Node.js + Express (or Fastify) + TypeScript
- Validation: `zod` for request/response schemas
- Database + Auth + Realtime: Supabase (Postgres under the hood)
- AI: Anthropic Claude API
- Messaging: WhatsApp Cloud API (Meta), client's own Business Account
- Deployment: Docker Compose, Nginx + HTTPS, single instance per client (single-tenant)

Existing frontend structure (do not restructure):
```
src/
  App.tsx
  context/CRMContext.tsx      -- ALL app state + mock data lives here today
  components/                 -- Sidebar, Header, modals
  pages/                      -- Dashboard, Leads, Conversations, Contacts,
                                  Scheduled, Templates, BulkMessage,
                                  Qualification, TestChat, Settings
  types/index.ts
```

---

## Task 0 — Reconcile the Lead status enum

Do this before anything else — every screen renders off this value.

- Canonical `LeadStatus` to use everywhere (frontend and Supabase schema):
  `'New' | 'Qualifying' | 'Warm' | 'Hot' | 'Qualified' | 'Cold' | 'Closed'`

Update `LeadStatus` in `src/types/index.ts` to this list. Update every reference in `CRMContext.tsx` mock data (`initialLeads`, `initialConversations`) and any status-based styling in `pages/`/`components/` that still uses the old `'Unqualified'` value.

**Definition of done:** `grep -r "Unqualified" src/` returns nothing. App still builds and renders with mock data.

---

## Task 1 — Set up the Supabase project

- Create a Supabase project for this client deployment (one project per client — this is your "single-tenant" unit now, replacing what would've been a separate database server)
- Enable **Supabase Auth** (email/password is enough to start)
- Create tables via SQL migrations (`supabase/migrations` folder), not ad-hoc dashboard edits, so schema is version-controlled

```sql
company_config
  id, name, industry, timezone,
  meta_waba_id, meta_phone_number_id,
  meta_access_token_encrypted, meta_webhook_verify_token,
  ai_model, ai_temperature, hot_threshold int default 85

leads
  id, name, email, phone, company, company_size, budget_authority boolean,
  status text, lead_score int, score_breakdown jsonb,
  last_active_at timestamptz, tags jsonb, assigned_to text,
  notes text, created_at timestamptz default now()

conversations
  id, lead_id references leads(id), status text, lead_score int,
  sentiment text, unread_count int default 0,
  human_takeover boolean default false,
  last_message_at timestamptz, created_at timestamptz default now()

messages
  id, conversation_id references conversations(id),
  sender text, sender_name text, content text,
  status text, created_at timestamptz default now()

qualification_questions
  id, field_name text, field_type text, hint_text text,
  required boolean, weight_points int, sort_order int

scheduled_messages
  id, campaign_title text, recipient_group text, recipient_count int,
  template_id uuid, scheduled_time timestamptz, status text

templates
  id, name text, category text, content text,
  variables jsonb, updated_at timestamptz default now()

contacts
  id, name text, phone text, email text, company text,
  tags jsonb, status text, total_messages_sent int,
  last_contacted_at timestamptz
```

- Enable **Row Level Security (RLS)** on every table, with a policy allowing access only to authenticated users of this project. Since this is single-tenant (one company per Supabase project), the policy can simply be "authenticated users can read/write" — no `company_id` filtering needed, unlike a shared multi-tenant setup.
- Enable **Realtime** on the `messages` and `conversations` tables (Supabase dashboard → Replication) — this is what Task 8 will use for live updates.

**Definition of done:** Tables exist, RLS is on, a manual insert via the Supabase dashboard succeeds and is blocked for unauthenticated requests.

---

## Task 2 — Scaffold the Node.js backend

- Express (or Fastify) + TypeScript project, `tsconfig.json`, Docker Compose, `/health` endpoint
- Install `@supabase/supabase-js` for server-side Supabase access (using the service role key — backend only, never sent to frontend)
- Install `zod` for request validation
- `.env` for: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` — all backend-only secrets

**Definition of done:** `/health` returns 200, server connects to Supabase successfully on boot (a startup check query).

---

## Task 3 — Auth (mostly just wiring, Supabase does the work)

- Frontend calls **Supabase Auth directly** using `@supabase/supabase-js` in the browser (with the public anon key, which is safe to expose — RLS protects the data) for `login`, `signup`, `logout`, and session handling
- Backend just needs middleware that verifies the Supabase JWT on incoming requests and rejects unauthenticated calls
- No password hashing or JWT-issuing code needs to be written — Supabase Auth handles all of it

**Definition of done:** A signed-up user can log in from the frontend, the session persists on refresh, and a backend endpoint correctly rejects a request with no/invalid token.

---

## Task 4 — Core CRUD endpoints matching CRMContext functions

Build one endpoint per existing frontend function in `CRMContext.tsx`:

| Frontend function | Endpoint |
|---|---|
| `leads` (list) | `GET /leads` |
| `addLead` | `POST /leads` |
| `updateLead` | `PATCH /leads/:id` |
| `deleteLead` | `DELETE /leads/:id` |
| `updateLeadStatus` | `PATCH /leads/:id/status` |
| `conversations` (list) | `GET /conversations` |
| `addConversationMessage` | `POST /conversations/:id/messages` |
| `toggleHumanTakeover` | `PATCH /conversations/:id/takeover` |
| `deleteConversation` | `DELETE /conversations/:id` |
| `questions` (list) | `GET /qualification-questions` |
| `addQuestion` / `updateQuestion` / `removeQuestion` | `POST` / `PATCH` / `DELETE /qualification-questions/:id` |
| `scheduledMessages` (list) | `GET /scheduled-messages` |
| `addScheduledMessage` etc. | `POST` / `PATCH` / `DELETE /scheduled-messages/:id` |
| `templates` (list) | `GET /templates` |
| `addTemplate` etc. | `POST` / `PATCH` / `DELETE /templates/:id` |
| `contacts` (list) | `GET /contacts` |
| `addContact` etc. | `POST` / `PATCH` / `DELETE /contacts/:id` |
| `convertLeadToContact` | `POST /leads/:id/convert-to-contact` |
| `exportData` | `GET /leads/export.csv` |

Every route uses `zod` schemas to validate the request body and query params before touching Supabase. All routes require a valid Supabase session (Task 3's middleware).

**Note:** for simple reads/writes with no extra business logic (e.g. listing templates, listing contacts), it's fine for the frontend to query Supabase **directly** via `@supabase/supabase-js` instead of going through your Express backend at all — RLS protects it. Reserve your custom backend endpoints for things that need real logic: lead scoring, WhatsApp sending, anything touching the Claude API. Decide per-endpoint and note the decision in code comments so it's not ambiguous later.

**Definition of done:** Every function above has a working, tested endpoint or a deliberate direct-Supabase-call replacement. No AI or WhatsApp logic yet — this task is CRUD only.

---

## Task 5 — Settings (fix the exposed API key issue)

The current frontend Settings page shows and edits the Claude API key directly in browser state — do not replicate that.

- `GET /settings` → returns `aiActive, model, temperature, autoQualify, whatsappConnected, phoneNumber` and a masked indicator (e.g. `whatsappTokenLast4: "a91c"`) — never a raw secret
- `PATCH /settings` → updates non-secret fields only
- `POST /settings/connect-whatsapp` → accepts the real Meta token/phone number ID once, stores it in `company_config` (encrypted, or at minimum in a column only the service-role key can read — never exposed via the anon key/RLS to the frontend), never returns it again
- In `pages/Settings.tsx`, update the "AI Intelligence Model Configuration" dropdown to only list supported Claude models (`claude-haiku-4-5`, `claude-sonnet-5`) — remove GPT-4o/Llama options left over from the template

**Definition of done:** `GET /settings` response never contains a raw secret, confirmed by inspecting the response body.

---

## Task 6 — WhatsApp webhook + AI reply engine

- `GET /webhook` — Meta verification handshake, checked against `meta_webhook_verify_token` from `company_config`
- `POST /webhook` — inbound message receiver: find/create lead by phone number, find/create the open conversation, insert the message row into Supabase, queue the AI reply as an async job (don't block the webhook response — Meta has a timeout)
- AI reply engine: build the system prompt from `company_config` + `qualification_questions` + the lead's existing `score_breakdown`; call the AI provider with structured output (tool-use/JSON mode) to get both reply text and newly extracted qualification fields; recompute `lead_score` deterministically (not another AI call); if it crosses `hot_threshold`, flip status to `Hot`; send the reply via WhatsApp Cloud API

**Keep the AI provider swappable.** Write this as a single `getAIReply(systemPrompt, conversationHistory)` function behind one interface, with the actual provider (Claude or Gemini) selected via an env var (`AI_PROVIDER=claude` or `AI_PROVIDER=gemini`). Reasoning: free-tier demos for prospects can run on Gemini (no cost, no expiring credit), while real paying clients run on Claude (better structured-output reliability, worth the small per-conversation cost). Don't let any Claude-specific or Gemini-specific request formatting leak into the qualification/scoring logic elsewhere in the codebase — that logic should only ever see "reply text + extracted fields," regardless of which provider produced them.

**Definition of done:** A test message through the webhook creates a lead in Supabase, gets an AI reply sent back, and `lead_score`/`status` update correctly — verified with a simulated 3-message conversation test.

---

## Task 7 — Rewrite `CRMContext.tsx` to call the real backend + Supabase

Do not touch `pages/` or `components/` — the goal is that this swap is invisible to every screen, since they already consume `useCRM()` the same way.

1. Create `src/services/supabaseClient.ts` — initializes `@supabase/supabase-js` with the public anon key + URL from `import.meta.env`
2. Create `src/services/api.ts` — a thin fetch wrapper for your custom Express endpoints (Task 4/5/6), attaching the current Supabase session token to each request
3. In `CRMContext.tsx`:
   - Replace `useState(() => getStored(...))` initial loads with data fetched on mount (either via `api.ts` or direct Supabase queries, per the Task 4 decision), with loading state
   - Replace every mutator (`addLead`, `updateLead`, etc.) to call the real endpoint/Supabase query, then update local state from the actual response — don't optimistically assume, especially for computed fields like `leadScore`
   - Remove the `localStorage` sync `useEffect` entirely — Supabase is now the source of truth
   - Replace `login`/`signup`/`logout` with real Supabase Auth calls
   - Remove the raw `apiKey` field from `SettingsType` — replace with `whatsappTokenLast4: string` and a `connectWhatsapp(token, phoneNumberId)` function posting to `/settings/connect-whatsapp`

**Definition of done:** App runs against real Supabase data with zero `localStorage` reads/writes for app data. Refreshing the page shows the same data.

---

## Task 8 — Live updates in Conversations (Supabase Realtime)

- Subscribe to Postgres changes on the `messages` table (and optionally `conversations`) using `supabase.channel(...)` in the Conversations page or in `CRMContext.tsx`
- On a new message insert for the currently-open conversation, append it to state directly — no polling needed
- Clean up the subscription on unmount

**Definition of done:** Sending a test WhatsApp message to the connected number shows up in the Conversations UI within a second or two, with no manual refresh and no polling interval running.

---

## Task 9 — Cleanup pass

- Global find-replace: `GreenLead` → `Skybridge` (or final brand name) across `context/CRMContext.tsx` mock data and UI copy
- Remove now-unused `getStored`/`resetToDefaults`/localStorage helper functions from `CRMContext.tsx`
- Add `.env.example` to both frontend and backend roots (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` on frontend; `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` on backend)

**Definition of done:** No references to "GreenLead" remain; no dead localStorage code remains; both `.env.example` files present; app builds clean.

---

## Build Order Summary

0. Fix LeadStatus enum
1. Supabase project + schema + RLS + Realtime enabled
2. Node/Express backend scaffold
3. Auth (Supabase-driven)
4. Core CRUD endpoints
5. Settings (secure)
6. WhatsApp webhook + AI engine
7. Rewire CRMContext to real backend/Supabase
8. Live updates via Realtime
9. Cleanup

Do not skip Task 0. Do not skip the RLS step in Task 1 — without it, the anon key would expose all data to anyone who inspects the frontend's network requests.
