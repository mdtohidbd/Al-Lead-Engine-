-- Migration: 00001_initial_schema
-- Description: Initial schema for Skybridge CRM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Company Config
-- Single-tenant design: only one row should exist here.
CREATE TABLE company_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    meta_whatsapp_token TEXT,
    meta_phone_number_id TEXT,
    meta_verify_token TEXT,
    ai_provider TEXT DEFAULT 'claude', -- 'claude' or 'gemini'
    ai_system_prompt TEXT,
    hot_lead_threshold INTEGER DEFAULT 85,
    warm_lead_threshold INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL UNIQUE,
    company TEXT,
    company_size TEXT,
    budget_authority BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Qualifying', 'Warm', 'Hot', 'Qualified', 'Cold', 'Closed'
    lead_score INTEGER DEFAULT 0,
    score_breakdown JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    assigned_to TEXT,
    notes TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    sentiment TEXT DEFAULT 'neutral', -- 'positive', 'neutral', 'negative'
    unread_count INTEGER DEFAULT 0,
    human_takeover BOOLEAN DEFAULT false,
    last_message_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user', 'ai', 'agent'
    sender_name TEXT,
    text TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Qualification Questions
CREATE TABLE qualification_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL, -- 'Number Range', 'Text Input', 'Multiple Choice', 'Boolean (Yes/No)'
    hint_text TEXT,
    required BOOLEAN DEFAULT false,
    weight_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Templates
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Onboarding', 'Lead Nurture', 'Event Follow-up', 'Sales Closing', 'General'
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Scheduled Messages
CREATE TABLE scheduled_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_title TEXT NOT NULL,
    recipient_group TEXT,
    recipient_count INTEGER DEFAULT 0,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'Draft', -- 'Scheduled', 'Sent', 'Failed', 'Draft'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    company TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Closed',
    total_messages_sent INTEGER DEFAULT 0,
    last_contacted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE company_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualification_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create Policies (allowing authenticated users full access for now)
CREATE POLICY "Enable all access for authenticated users on company_config" ON company_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on leads" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on conversations" ON conversations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on messages" ON messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on qualification_questions" ON qualification_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on templates" ON templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on scheduled_messages" ON scheduled_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users on contacts" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Functions to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_config_modtime BEFORE UPDATE ON company_config FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_leads_modtime BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_conversations_modtime BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_qualification_questions_modtime BEFORE UPDATE ON qualification_questions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_scheduled_messages_modtime BEFORE UPDATE ON scheduled_messages FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_contacts_modtime BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Enable Realtime for conversations and messages
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
