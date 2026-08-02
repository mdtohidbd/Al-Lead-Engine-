import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  LeadStatus,
  Conversation,
  ChatMessage,
  QualificationQuestion,
  ScheduledMessage,
  MessageTemplate,
  Contact,
} from '../types';

interface SettingsType {
  aiActive: boolean;
  model: string;
  temperature: number;
  autoQualify: boolean;
  webhookUrl: string;
  apiKey: string;
  whatsappConnected: boolean;
  phoneNumber: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  isLoggedIn: boolean;
}

interface CRMContextType {
  leads: Lead[];
  conversations: Conversation[];
  questions: QualificationQuestion[];
  scheduledMessages: ScheduledMessage[];
  templates: MessageTemplate[];
  contacts: Contact[];
  settings: SettingsType;
  hotThreshold: number;
  user: UserProfile;

  // Global Modals State
  isCreateLeadOpen: boolean;
  setCreateLeadOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  isUpgradeOpen: boolean;
  setUpgradeOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setHelpOpen: (open: boolean) => void;

  // Auth Functions
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => void;
  logout: () => void;
  exportData: () => void;

  setHotThreshold: (val: number) => void;
  updateSettings: (newSettings: Partial<SettingsType>) => void;
  addQuestion: (question: Omit<QualificationQuestion, 'id'>) => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, updated: Partial<QualificationQuestion>) => void;
  addLead: (lead: Omit<Lead, 'id' | 'leadScore' | 'scoreBreakdown' | 'createdAt' | 'lastActive'> & Partial<Lead>) => void;
  updateLead: (id: string, updated: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  addConversationMessage: (convId: string, message: { text: string; sender: 'user' | 'ai' | 'agent' }) => void;
  toggleHumanTakeover: (convId: string) => void;
  deleteConversation: (convId: string) => void;
  addScheduledMessage: (msg: Omit<ScheduledMessage, 'id'>) => void;
  updateScheduledMessageStatus: (id: string, status: ScheduledMessage['status']) => void;
  deleteScheduledMessage: (id: string) => void;
  addTemplate: (template: Omit<MessageTemplate, 'id' | 'lastModified'>) => void;
  updateTemplate: (id: string, updated: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updated: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  convertLeadToContact: (leadId: string) => void;
  resetToDefaults: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const initialQuestions: QualificationQuestion[] = [
  {
    id: 'q-1',
    fieldName: 'Company Size',
    fieldType: 'Number Range',
    hintText: 'e.g. How many employees work at your HQ?',
    required: true,
    weightPoints: 45,
  },
  {
    id: 'q-2',
    fieldName: 'Budget Authority',
    fieldType: 'Boolean (Yes/No)',
    hintText: 'Do you have signing authority for software purchases?',
    required: true,
    weightPoints: 30,
  },
  {
    id: 'q-3',
    fieldName: 'Purchase Timeline',
    fieldType: 'Multiple Choice',
    hintText: 'When do you plan to roll out this solution?',
    required: false,
    weightPoints: 15,
  },
  {
    id: 'q-4',
    fieldName: 'Current Solution',
    fieldType: 'Text Input',
    hintText: 'What tool are you currently using?',
    required: false,
    weightPoints: 10,
  },
];

const initialLeads: Lead[] = [
  {
    id: 'lead-101',
    name: 'Sarah Jenkins',
    email: 's.jenkins@acmecorp.com',
    phone: '+1 (555) 234-5678',
    company: 'Acme Corp',
    companySize: '500+',
    budgetAuthority: true,
    status: 'Hot',
    leadScore: 92,
    scoreBreakdown: [
      { label: 'Company Size: 500+', points: 45 },
      { label: 'Budget Authority: Yes', points: 30 },
      { label: 'Timeline: Immediately', points: 17 },
    ],
    lastActive: '10 mins ago',
    tags: ['Enterprise', 'High Priority'],
    assignedTo: 'Alex Rivera',
    createdAt: '2026-08-01',
  },
  {
    id: 'lead-102',
    name: 'Marcus Vance',
    email: 'm.vance@techwave.io',
    phone: '+1 (555) 876-5432',
    company: 'TechWave Inc',
    companySize: '50-200',
    budgetAuthority: true,
    status: 'Warm',
    leadScore: 78,
    scoreBreakdown: [
      { label: 'Company Size: 50-200', points: 30 },
      { label: 'Budget Authority: Yes', points: 30 },
      { label: 'Timeline: 3 Months', points: 18 },
    ],
    lastActive: '1 hour ago',
    tags: ['Mid-Market', 'Demo Scheduled'],
    assignedTo: 'Sarah Jenkins',
    createdAt: '2026-07-30',
  },
  {
    id: 'lead-103',
    name: 'Elena Rostova',
    email: 'elena@biogreen.de',
    phone: '+49 171 555 0192',
    company: 'BioGreen Solutions',
    companySize: '20-50',
    budgetAuthority: false,
    status: 'Cold',
    leadScore: 45,
    scoreBreakdown: [
      { label: 'Company Size: 20-50', points: 15 },
      { label: 'Budget Authority: No', points: 0 },
      { label: 'Timeline: Exploring', points: 30 },
    ],
    lastActive: '1 day ago',
    tags: ['SMB', 'Nurture'],
    assignedTo: 'AI Engine',
    createdAt: '2026-07-28',
  },
  {
    id: 'lead-104',
    name: 'David Chen',
    email: 'd.chen@apexscale.com',
    phone: '+1 (555) 432-1098',
    company: 'ApexScale Capital',
    companySize: '1000+',
    budgetAuthority: true,
    status: 'Qualified',
    leadScore: 98,
    scoreBreakdown: [
      { label: 'Company Size: 1000+', points: 45 },
      { label: 'Budget Authority: Yes', points: 30 },
      { label: 'Timeline: Immediate', points: 23 },
    ],
    lastActive: '5 mins ago',
    tags: ['VIP', 'Contract Sent'],
    assignedTo: 'Alex Rivera',
    createdAt: '2026-08-01',
  },
];

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    leadId: 'lead-101',
    leadName: 'Sarah Jenkins',
    leadPhone: '+1 (555) 234-5678',
    leadAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'Hot',
    leadScore: 92,
    sentiment: 'positive',
    unreadCount: 0,
    humanTakeover: false,
    lastMessageTime: '10:42 AM',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        senderName: 'Sarah Jenkins',
        text: "Hi! We're looking to automate our WhatsApp lead scoring for 500+ agents. Is GreenLead ready for enterprise deployment?",
        timestamp: '10:40 AM',
      },
      {
        id: 'm2',
        sender: 'ai',
        senderName: 'AI Lead Agent',
        text: 'Hello Sarah! Absolutely. GreenLead AI supports multi-tenant enterprise WhatsApp setups, custom CRM webhooks, and SOC2 compliance.',
        timestamp: '10:41 AM',
      },
      {
        id: 'm3',
        sender: 'user',
        senderName: 'Sarah Jenkins',
        text: 'Great! Can we schedule a quick demo call today at 3 PM EST?',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    leadId: 'lead-102',
    leadName: 'Marcus Vance',
    leadPhone: '+1 (555) 876-5432',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Warm',
    leadScore: 78,
    sentiment: 'neutral',
    unreadCount: 1,
    humanTakeover: true,
    lastMessageTime: '09:15 AM',
    messages: [
      {
        id: 'm21',
        sender: 'user',
        senderName: 'Marcus Vance',
        text: 'What are your monthly subscription tiers for 200 team members?',
        timestamp: '09:15 AM',
      },
    ],
  },
];

const initialScheduled: ScheduledMessage[] = [
  {
    id: 'sm-1',
    campaignTitle: 'Q3 Enterprise Lead Outreach',
    recipientGroup: 'Hot Leads (Score > 85)',
    recipientCount: 142,
    templateName: 'Demo Invitation Broadcast',
    scheduledTime: 'Today at 4:00 PM EST',
    status: 'Scheduled',
  },
  {
    id: 'sm-2',
    campaignTitle: 'Post-Webinar Follow-up Blast',
    recipientGroup: 'Webinar Attendees',
    recipientCount: 520,
    templateName: 'Resource Link & Call Booking',
    scheduledTime: 'Tomorrow at 10:00 AM EST',
    status: 'Scheduled',
  },
  {
    id: 'sm-3',
    campaignTitle: 'Re-engagement Reactivation',
    recipientGroup: 'Inactive Cold Leads (>30 Days)',
    recipientCount: 1250,
    templateName: 'Special Offer Discount',
    scheduledTime: 'Yesterday at 2:00 PM EST',
    status: 'Sent',
  },
];

const initialTemplates: MessageTemplate[] = [
  {
    id: 't-1',
    name: 'Demo Invitation Broadcast',
    category: 'Sales Closing',
    content: "Hi {{first_name}}! Based on {{company}}'s team size, our AI engine can save your reps 12+ hours weekly. Would you be open for a 10-min demo?",
    variables: ['{{first_name}}', '{{company}}'],
    lastModified: 'Aug 1, 2026',
  },
  {
    id: 't-2',
    name: 'Resource Link & Call Booking',
    category: 'Lead Nurture',
    content: 'Hello {{first_name}}, thanks for checking out our whitepaper! Here is your download link: {{link}}. Let us know if you have questions.',
    variables: ['{{first_name}}', '{{link}}'],
    lastModified: 'Jul 28, 2026',
  },
  {
    id: 't-3',
    name: 'Instant Qualification Reply',
    category: 'Onboarding',
    content: 'Thanks for reaching out! To better assist {{company}}, how many sales reps currently manage your lead pipeline?',
    variables: ['{{company}}'],
    lastModified: 'Aug 2, 2026',
  },
];

const initialContacts: Contact[] = [
  {
    id: 'c-1',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    email: 's.jenkins@acmecorp.com',
    company: 'Acme Corp',
    tags: ['Enterprise', 'Hot'],
    status: 'Hot',
    totalMessagesSent: 18,
    lastContacted: '10 mins ago',
  },
  {
    id: 'c-2',
    name: 'Marcus Vance',
    phone: '+1 (555) 876-5432',
    email: 'm.vance@techwave.io',
    company: 'TechWave Inc',
    tags: ['Mid-Market'],
    status: 'Warm',
    totalMessagesSent: 8,
    lastContacted: '1 hour ago',
  },
  {
    id: 'c-3',
    name: 'David Chen',
    phone: '+1 (555) 432-1098',
    email: 'd.chen@apexscale.com',
    company: 'ApexScale Capital',
    tags: ['VIP', 'Qualified'],
    status: 'Qualified',
    totalMessagesSent: 34,
    lastContacted: '5 mins ago',
  },
];

const initialSettings: SettingsType = {
  aiActive: true,
  model: 'GPT-4o / Claude-3.5',
  temperature: 0.7,
  autoQualify: true,
  webhookUrl: 'https://api.greenlead.ai/v1/webhooks/whatsapp',
  apiKey: 'gl_live_89a7f39b1092e47c',
  whatsappConnected: true,
  phoneNumber: '+1 (800) 555-GREEN',
};

const defaultUser: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex@leadengine.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  role: 'Lead Administrator',
  isLoggedIn: true,
};

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const saved = localStorage.getItem(`greenlead_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotThreshold, setHotThresholdState] = useState<number>(() => getStored('hotThreshold', 85));
  const [questions, setQuestions] = useState<QualificationQuestion[]>(() => getStored('questions', initialQuestions));
  const [leads, setLeads] = useState<Lead[]>(() => getStored('leads', initialLeads));
  const [conversations, setConversations] = useState<Conversation[]>(() => getStored('conversations', initialConversations));
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(() => getStored('scheduled', initialScheduled));
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => getStored('templates', initialTemplates));
  const [contacts, setContacts] = useState<Contact[]>(() => getStored('contacts', initialContacts));
  const [settings, setSettings] = useState<SettingsType>(() => getStored('settings', initialSettings));
  const [user, setUser] = useState<UserProfile>(() => getStored('user', defaultUser));

  // Global Modals State
  const [isCreateLeadOpen, setCreateLeadOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('greenlead_hotThreshold', JSON.stringify(hotThreshold));
    localStorage.setItem('greenlead_questions', JSON.stringify(questions));
    localStorage.setItem('greenlead_leads', JSON.stringify(leads));
    localStorage.setItem('greenlead_conversations', JSON.stringify(conversations));
    localStorage.setItem('greenlead_scheduled', JSON.stringify(scheduledMessages));
    localStorage.setItem('greenlead_templates', JSON.stringify(templates));
    localStorage.setItem('greenlead_contacts', JSON.stringify(contacts));
    localStorage.setItem('greenlead_settings', JSON.stringify(settings));
    localStorage.setItem('greenlead_user', JSON.stringify(user));
  }, [hotThreshold, questions, leads, conversations, scheduledMessages, templates, contacts, settings, user]);

  const setHotThreshold = (val: number) => setHotThresholdState(val);

  const login = (email: string, pass: string) => {
    setUser({
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      role: 'Lead Administrator',
      isLoggedIn: true,
    });
    setAuthModalOpen(false);
    return true;
  };

  const signup = (name: string, email: string, pass: string) => {
    setUser({
      name: name || 'New Admin User',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      role: 'Campaign Specialist',
      isLoggedIn: true,
    });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setAuthModalOpen(true);
  };

  const exportData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,Company,Status,Score'].join(',') +
      '\n' +
      leads.map((l) => `"${l.name}","${l.email}","${l.phone}","${l.company}","${l.status}",${l.leadScore}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `greenlead_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateSettings = (newSettings: Partial<SettingsType>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addQuestion = (question: Omit<QualificationQuestion, 'id'>) => {
    const newQ: QualificationQuestion = { ...question, id: `q-${Date.now()}` };
    setQuestions((prev) => [...prev, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updated: Partial<QualificationQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updated } : q)));
  };

  const addLead = (leadInput: Omit<Lead, 'id' | 'leadScore' | 'scoreBreakdown' | 'createdAt' | 'lastActive'> & Partial<Lead>) => {
    const calculatedScore = leadInput.leadScore ?? Math.floor(Math.random() * 40) + 50;
    const status: LeadStatus = leadInput.status || (calculatedScore >= hotThreshold ? 'Hot' : calculatedScore >= 60 ? 'Warm' : 'Cold');
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadInput.name,
      email: leadInput.email,
      phone: leadInput.phone,
      company: leadInput.company,
      companySize: leadInput.companySize || '50-200',
      budgetAuthority: leadInput.budgetAuthority ?? true,
      status,
      leadScore: calculatedScore,
      scoreBreakdown: leadInput.scoreBreakdown || [
        { label: `Company Size: ${leadInput.companySize || '50-200'}`, points: 30 },
        { label: `Budget Authority: ${leadInput.budgetAuthority ? 'Yes' : 'No'}`, points: leadInput.budgetAuthority ? 30 : 0 },
      ],
      lastActive: 'Just now',
      tags: leadInput.tags || ['New Lead'],
      assignedTo: leadInput.assignedTo || 'AI Engine',
      createdAt: new Date().toISOString().split('T')[0],
      notes: leadInput.notes || '',
    };
    setLeads((prev) => [newLead, ...prev]);

    // Also auto-create conversation
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      leadId: newLead.id,
      leadName: newLead.name,
      leadPhone: newLead.phone,
      status: newLead.status,
      leadScore: newLead.leadScore,
      sentiment: 'positive',
      unreadCount: 0,
      humanTakeover: false,
      lastMessageTime: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'ai',
          senderName: 'AI Lead Agent',
          text: `Hello ${newLead.name}! Thank you for reaching out to GreenLead AI. How can we help ${newLead.company} grow today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
  };

  const updateLead = (id: string, updated: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setConversations((prev) => prev.filter((c) => c.leadId !== id));
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setConversations((prev) => prev.map((c) => (c.leadId === id ? { ...c, status } : c)));
  };

  const addConversationMessage = (convId: string, msg: { text: string; sender: 'user' | 'ai' | 'agent' }) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === convId) {
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: msg.sender,
            senderName: msg.sender === 'user' ? conv.leadName : msg.sender === 'ai' ? 'AI Lead Agent' : user.name,
            text: msg.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
          };
          return {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessageTime: 'Just now',
          };
        }
        return conv;
      })
    );
  };

  const toggleHumanTakeover = (convId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, humanTakeover: !c.humanTakeover } : c)));
  };

  const deleteConversation = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
  };

  const addScheduledMessage = (msg: Omit<ScheduledMessage, 'id'>) => {
    const newMsg: ScheduledMessage = { ...msg, id: `sm-${Date.now()}` };
    setScheduledMessages((prev) => [newMsg, ...prev]);
  };

  const updateScheduledMessageStatus = (id: string, status: ScheduledMessage['status']) => {
    setScheduledMessages((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const deleteScheduledMessage = (id: string) => {
    setScheduledMessages((prev) => prev.filter((s) => s.id !== id));
  };

  const addTemplate = (template: Omit<MessageTemplate, 'id' | 'lastModified'>) => {
    const newT: MessageTemplate = {
      ...template,
      id: `t-${Date.now()}`,
      lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setTemplates((prev) => [newT, ...prev]);
  };

  const updateTemplate = (id: string, updated: Partial<MessageTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updated,
              lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            }
          : t
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newC: Contact = { ...contact, id: `c-${Date.now()}` };
    setContacts((prev) => [...prev, newC]);
  };

  const updateContact = (id: string, updated: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const convertLeadToContact = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (!contacts.some((c) => c.email === lead.email)) {
      const newContact: Contact = {
        id: `c-${Date.now()}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        tags: lead.tags,
        status: lead.status,
        totalMessagesSent: 1,
        lastContacted: 'Just now',
      };
      setContacts((prev) => [newContact, ...prev]);
    }
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setHotThresholdState(85);
    setQuestions(initialQuestions);
    setLeads(initialLeads);
    setConversations(initialConversations);
    setScheduledMessages(initialScheduled);
    setTemplates(initialTemplates);
    setContacts(initialContacts);
    setSettings(initialSettings);
    setUser(defaultUser);
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        conversations,
        questions,
        scheduledMessages,
        templates,
        contacts,
        settings,
        hotThreshold,
        user,
        isCreateLeadOpen,
        setCreateLeadOpen,
        isAuthModalOpen,
        setAuthModalOpen,
        isNotificationsOpen,
        setNotificationsOpen,
        isUpgradeOpen,
        setUpgradeOpen,
        isHelpOpen,
        setHelpOpen,
        login,
        signup,
        logout,
        exportData,
        setHotThreshold,
        updateSettings,
        addQuestion,
        removeQuestion,
        updateQuestion,
        addLead,
        updateLead,
        deleteLead,
        updateLeadStatus,
        addConversationMessage,
        toggleHumanTakeover,
        deleteConversation,
        addScheduledMessage,
        updateScheduledMessageStatus,
        deleteScheduledMessage,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addContact,
        updateContact,
        deleteContact,
        convertLeadToContact,
        resetToDefaults,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
};


