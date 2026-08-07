**Analysis Date:** 2026-08-07

## Integrations Overview
Currently, the application is entirely a frontend mockup, relying heavily on local React state and `localStorage` for data persistence. It does not integrate with any external APIs natively in the `main` branch yet.

### Current Integrations
- None (100% Mocked Data in `src/context/CRMContext.tsx`)

### Planned Integrations (As per Agent-Task-List-Backend-Wiring.md)
The application will integrate with the following services as it transitions to a full-stack solution:

#### 1. Supabase (Postgres, Auth, Realtime)
- Will replace `localStorage` as the primary data store
- Will handle user authentication (`email`/`password`)
- Will provide real-time updates for `messages` and `conversations` tables

#### 2. Anthropic Claude API (or Gemini)
- Will power the AI reply engine to qualify leads
- Uses structured output (tool-use/JSON mode) to extract qualification fields and compute lead scores
- Provider will be swappable via `AI_PROVIDER` environment variable

#### 3. WhatsApp Cloud API (Meta)
- Will handle inbound webhooks for user messages
- Will send out AI replies to users

*Last refreshed codebase analysis: 2026-08-07*
<!-- refreshed: 2026-08-07 -->
