-- Migration: 00002_add_ai_active_flag
-- Description: Adds the ai_active feature flag to company_config to act as a kill-switch for automated AI actions.

ALTER TABLE company_config
ADD COLUMN ai_active BOOLEAN DEFAULT true;
