export type LeadStatus = 'New' | 'Qualifying' | 'Warm' | 'Hot' | 'Qualified' | 'Cold' | 'Closed';

export interface ScoreBreakdown {
  label: string;
  points: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companySize?: string;
  budgetAuthority?: boolean;
  status: LeadStatus;
  leadScore: number;
  scoreBreakdown: ScoreBreakdown[];
  lastActive: string;
  tags: string[];
  assignedTo: string;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'agent';
  senderName: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadAvatar?: string;
  status: LeadStatus;
  leadScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  unreadCount: number;
  humanTakeover: boolean;
  messages: ChatMessage[];
  lastMessageTime: string;
}

export interface QualificationQuestion {
  id: string;
  fieldName: string;
  fieldType: 'Number Range' | 'Text Input' | 'Multiple Choice' | 'Boolean (Yes/No)';
  hintText: string;
  required: boolean;
  weightPoints: number;
}

export interface ScheduledMessage {
  id: string;
  campaignTitle: string;
  recipientGroup: string;
  recipientCount: number;
  templateName: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Sent' | 'Failed' | 'Draft';
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'Onboarding' | 'Lead Nurture' | 'Event Follow-up' | 'Sales Closing' | 'General';
  content: string;
  variables: string[];
  lastModified: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  tags: string[];
  status: LeadStatus;
  totalMessagesSent: number;
  lastContacted: string;
}
