# Skybridge — AI WhatsApp Lead Qualification Platform

## What this project is

This is **not a chatbot**. It's a lead qualification and handoff system that runs on top of WhatsApp.

A business connects its WhatsApp number. When a customer messages them, an AI (Claude) has the conversation — but instead of just answering questions, it's quietly extracting qualifying information (budget, timeline, intent, whatever matters for that business) and scoring the lead in real time. Once a lead crosses a "hot" threshold, it's surfaced to a human salesperson with the qualification summary already filled in, so they only spend time on leads worth their time.

The differentiator from a generic WhatsApp chatbot: **the output isn't a conversation, it's a ranked list of buyers.**

## Who this is for

Built first for internal use at Skybridge, then resold as a product to other businesses — initial target sectors are vehicle sales and property/real estate, where every inbound WhatsApp message is a potential high-value lead worth qualifying before a human spends time on it.

## Deployment model — read this before writing any code

**Single-tenant.** Each client gets their own deployment: own server, own database, own WhatsApp connection via their own Meta Business Account (Option B, chosen deliberately — full isolation, client owns their number and reputation, no risk of one client's spam behavior affecting another).

This is **not** a shared multi-tenant SaaS where multiple companies' data lives in one database. There is no `company_id` column scattered through tables. Each running instance of this codebase serves exactly one company.

**The one rule that keeps this reusable across clients:** every client-specific value — business name, industry, Meta credentials, AI system prompt inputs, qualification questions, hot-lead threshold — lives in a single `company_config` table/row, never hardcoded into business logic. Onboarding a new client means seeding that one config, not forking the code. If this rule is followed consistently, migrating to a shared multi-tenant architecture later (only worth doing if client count grows past ~15-20) becomes a refactor, not a rewrite.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript, Tailwind, React Router |
| Backend | Node.js + Express/Fastify (TypeScript) |
| Database | Supabase (Postgres) |
| Auth & Realtime | Supabase Auth, Supabase Realtime |
| AI | Anthropic Claude API (Haiku for cost efficiency; Sonnet where quality matters more) |
| Messaging | WhatsApp Cloud API (Meta), client's own Business Account |
| Infra | Docker Compose, Nginx + HTTPS (Certbot), one small Node process per client |
| Dev tooling | Google Antigravity (backend build), Stitch AI (frontend design, already built) |

## Current state of the repo

The **frontend already exists** (`src/`) — built via Stitch AI, refined by a frontend developer. It is a complete, polished UI covering every screen this product needs. It currently runs on **local React state + `localStorage` only** — there is no backend yet, no real auth, and no WhatsApp/AI integration. This is expected: the frontend was built first as a design/UX pass, and the backend is now being built to match it exactly.

**Do not redesign the frontend.** The visual and component structure is approved. The work from here is: build the Node.js backend, then rewire the frontend's data layer (`src/context/CRMContext.tsx`) to call real endpoints instead of local state.

## Screens (all exist in `src/pages/`)

- **Dashboard** — stat cards, setup checklist, quick actions, module health, recent leads
- **Leads** — the core screen. Sortable board of leads with score, status, qualification summary, assigned owner
- **Conversations** — two-pane WhatsApp-style chat view, AI/human takeover toggle
- **Contacts** — leads that have converted into ongoing contacts
- **Scheduled** — recurring/scheduled message campaigns
- **Templates** — Meta-approved and local message templates
- **Bulk Message** — send to a list of contacts from manual entry, CSV, CRM, or Airtable
- **Qualification** — the dynamic question-builder: define what fields the AI should extract per lead (field name, type, hint text, required, score weight) and the hot-lead threshold
- **Test Chat** — simulate a customer conversation against the current AI config before going live
- **Settings** — AI model/behavior config, WhatsApp connection status

## Core data model

```
company_config      -- one row per deployment: business info, Meta credentials
                        (encrypted), AI settings, hot_threshold
users                -- login accounts for this company's team
leads                -- one per unique WhatsApp contact, with status + score
conversations        -- one open/closed thread per lead
messages             -- individual messages within a conversation
qualification_questions  -- the dynamic fields the AI extracts per lead
scheduled_messages   -- recurring/scheduled campaigns
templates            -- reusable message templates (local + Meta-approved)
contacts             -- leads converted to ongoing contacts
```

**Lead status** (canonical, used consistently frontend and backend):
`New → Qualifying → Warm → Hot → Qualified → Cold / Closed`

## How a lead actually flows through the system

1. Customer messages the business's WhatsApp number
2. Meta sends the message to our webhook → lead + conversation created if new
3. Claude generates a reply using: business profile, FAQs, the qualification questions defined for this company, and whatever's already been captured for this lead
4. Claude's response includes both the reply text and any newly extracted qualification data (structured output, not regex)
5. Lead score recalculates deterministically from the weighted questions answered
6. If score crosses `hot_threshold`, status flips to Hot and the team is notified
7. A human can take over the conversation at any point (`human_takeover` flag) — AI stops replying, human sends manually through the same thread
8. Leads that don't convert immediately can be nurtured via Scheduled Messages or later included in a Bulk Message campaign

## Security notes — non-negotiable

- The Claude API key and each client's Meta WhatsApp access token are **backend-only secrets**. They must never be sent to, stored in, or editable from the browser. The current frontend Settings mock UI shows a raw API key field — this must **not** be replicated in the real implementation. See `Agent-Task-List-Backend-Wiring.md` Task 4 for the correct pattern (masked confirmation only, separate write-only "connect" endpoint).
- Use Supabase Auth for real signup/login/session handling out of the box (removes the need for custom JWT/password-hashing).
- Every automated action (AI reply, scheduled send, bulk send, event trigger) must check a feature-flag kill switch before executing, so the whole platform can be paused without redeploying.
- Scheduled/bulk jobs must run inside the always-on Node server (using node-cron or similar) rather than Supabase Edge Functions, to avoid execution time limits when rate-limiting bulk WhatsApp sending.

## What "done" looks like for the MVP

- Real inbound WhatsApp message → AI reply → qualification data extracted and visible in the Leads screen
- A human can take over a conversation and it behaves correctly
- Scheduled and bulk messaging work end to end, respecting feature flags
- Settings page never exposes a raw secret
- Deployed for one real client (or a free-tier demo instance) end to end over HTTPS

## Related documents in this repo/handoff

- `WhatsApp-AI-LeadGen-Build-Guide.md` — full backend build plan, phase by phase
- `Agent-Task-List-Backend-Wiring.md` — the immediate, ordered task list for wiring this existing frontend to a real backend (start here)
- `Stitch-AI-Frontend-Prompt.md` — the original design brief the frontend was built from (reference only, frontend is already built)

## Ground rules for anyone (or any agent) working on this repo

1. Don't hardcode anything client-specific — it goes in `company_config`.
2. Don't touch `src/pages/` or `src/components/` layout/design — only `src/context/CRMContext.tsx` and a new `src/services/api.ts` need to change on the frontend.
3. Secrets never round-trip to the browser.
4. Every new automation must respect feature flags.
5. Work in small, verifiable phases — write a test or a curl-based check for each phase before moving to the next.
