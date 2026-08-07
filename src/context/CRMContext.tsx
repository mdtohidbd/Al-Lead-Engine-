import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import * as api from '../services/api';
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
  verifyToken: string;
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
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
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

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotThreshold, setHotThresholdState] = useState<number>(85);
  const [questions, setQuestions] = useState<QualificationQuestion[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<SettingsType>({} as SettingsType);
  
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    role: '',
    isLoggedIn: false,
  });

  // Global Modals State
  const [isCreateLeadOpen, setCreateLeadOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          role: 'Admin',
          isLoggedIn: true,
        });
      } else {
        setAuthModalOpen(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          role: 'Admin',
          isLoggedIn: true,
        });
        setAuthModalOpen(false);
      } else {
        setUser({ name: '', email: '', avatar: '', role: '', isLoggedIn: false });
        setAuthModalOpen(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data when logged in
  useEffect(() => {
    if (!user.isLoggedIn) return;

    const mapLead = (l: any): Lead => ({
      ...l,
      leadScore: l.lead_score,
      companySize: l.company_size,
      budgetAuthority: l.budget_authority,
      scoreBreakdown: l.score_breakdown,
      assignedTo: l.assigned_to,
      lastActive: l.last_active,
      createdAt: l.created_at,
      updatedAt: l.updated_at,
    });

    const mapConversation = (c: any, leadsData: Lead[]): Conversation => {
      const lead = leadsData.find((l) => l.id === c.lead_id);
      return {
        ...c,
        leadId: c.lead_id,
        leadName: lead ? lead.name : 'Unknown Lead',
        leadPhone: lead ? lead.phone : '',
        leadScore: lead ? lead.leadScore : 0,
        humanTakeover: c.human_takeover,
        lastMessageTime: c.last_message_time ? new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        messages: (c.messages || []).map((m: any) => ({
          ...m,
          senderName: m.sender_name || (m.sender === 'user' ? (lead ? lead.name : 'User') : 'AI'),
          timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        })),
      };
    };

    const mapScheduled = (s: any): ScheduledMessage => ({
      ...s,
      campaignTitle: s.campaign_title,
      recipientGroup: s.recipient_group,
      recipientCount: s.recipient_count,
      templateId: s.template_id,
      scheduledTime: s.scheduled_time,
    });

    const mapContact = (c: any): Contact => ({
      ...c,
      totalMessagesSent: c.total_messages_sent,
      lastContacted: c.last_contacted,
    });

    const mapQuestion = (q: any): QualificationQuestion => ({
      ...q,
      fieldName: q.field_name,
      fieldType: q.field_type,
      hintText: q.hint_text,
      weightPoints: q.weight_points,
    });

    const mapTemplate = (t: any): MessageTemplate => ({
      ...t,
      lastModified: t.last_modified,
    });

    const fetchData = async () => {
      try {
        const [
          fetchedLeads,
          fetchedConvs,
          fetchedQuestions,
          fetchedTemplates,
          fetchedScheduled,
          fetchedContacts,
          fetchedSettings
        ] = await Promise.all([
          api.getLeads(),
          api.getConversations(),
          api.getQuestions(),
          api.getTemplates(),
          api.getScheduled(),
          api.getContacts(),
          api.getSettings(),
        ]);

        const mappedLeads = fetchedLeads.map(mapLead);
        setLeads(mappedLeads);
        setConversations(fetchedConvs.map((c: any) => mapConversation(c, mappedLeads)));
        setQuestions(fetchedQuestions.map(mapQuestion));
        setTemplates(fetchedTemplates.map(mapTemplate));
        setScheduledMessages(fetchedScheduled.map(mapScheduled));
        setContacts(fetchedContacts.map(mapContact));
        
        // Map backend settings to frontend
        if (fetchedSettings) {
          setSettings({
            aiActive: fetchedSettings.ai_active ?? true,
            model: fetchedSettings.ai_provider || 'claude',
            temperature: 0.7,
            autoQualify: true,
            webhookUrl: import.meta.env.VITE_API_URL || '',
            apiKey: fetchedSettings.meta_whatsapp_token || '',
            whatsappConnected: !!fetchedSettings.meta_whatsapp_token,
            phoneNumber: fetchedSettings.meta_phone_number_id || '',
            verifyToken: fetchedSettings.meta_verify_token || '',
          });
          setHotThresholdState(fetchedSettings.hot_lead_threshold || 85);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchData();

    // Supabase Realtime Subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, async () => {
        const [convs, lds] = await Promise.all([api.getConversations(), api.getLeads()]);
        const mappedLeads = lds.map(mapLead);
        setConversations(convs.map((c: any) => mapConversation(c, mappedLeads)));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, async () => {
        const [convs, lds] = await Promise.all([api.getConversations(), api.getLeads()]);
        const mappedLeads = lds.map(mapLead);
        setConversations(convs.map((c: any) => mapConversation(c, mappedLeads)));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, async () => {
        const lds = await api.getLeads();
        setLeads(lds.map(mapLead));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.isLoggedIn]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      alert(error.message);
      return false;
    }
    return true;
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) {
      alert(error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const exportData = () => {
    // (Unchanged simple CSV export)
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,Company,Status,Score'].join(',') +
      '\n' +
      leads.map((l) => `"${l.name}","${l.email}","${l.phone}","${l.company}","${l.status}",${l.leadScore}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `primequalify_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const setHotThreshold = (val: number) => {
    setHotThresholdState(val);
    api.updateSettings({ hot_lead_threshold: val }).catch(console.error);
  };

  const updateSettings = (newSettings: Partial<SettingsType>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    
    // Convert frontend settings to backend format
    const backendUpdate: any = {};
    if (newSettings.aiActive !== undefined) backendUpdate.ai_active = newSettings.aiActive;
    if (newSettings.model !== undefined) backendUpdate.ai_provider = newSettings.model;
    if (newSettings.apiKey !== undefined) backendUpdate.meta_whatsapp_token = newSettings.apiKey;
    if (newSettings.phoneNumber !== undefined) backendUpdate.meta_phone_number_id = newSettings.phoneNumber;
    if (newSettings.verifyToken !== undefined) backendUpdate.meta_verify_token = newSettings.verifyToken;
    
    if (Object.keys(backendUpdate).length > 0) {
      api.updateSettings(backendUpdate).catch(console.error);
    }
  };

  // Optimistic CRUD operations
  const addQuestion = async (question: Omit<QualificationQuestion, 'id'>) => {
    const newQ = await api.createQuestion(question);
    setQuestions((prev) => [...prev, newQ]);
  };

  const removeQuestion = async (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    await api.deleteQuestion(id);
  };

  const updateQuestion = async (id: string, updated: Partial<QualificationQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updated } : q)));
    await api.updateQuestion(id, updated);
  };

  const addLead = async (leadInput: Omit<Lead, 'id' | 'leadScore' | 'scoreBreakdown' | 'createdAt' | 'lastActive'> & Partial<Lead>) => {
    const calculatedScore = leadInput.leadScore ?? Math.floor(Math.random() * 40) + 50;
    const status: LeadStatus = leadInput.status || (calculatedScore >= hotThreshold ? 'Hot' : calculatedScore >= 60 ? 'Warm' : 'Cold');
    
    const dbLead = {
      name: leadInput.name,
      email: leadInput.email,
      phone: leadInput.phone,
      company: leadInput.company,
      company_size: leadInput.companySize,
      budget_authority: leadInput.budgetAuthority,
      status: status,
      lead_score: calculatedScore,
      tags: leadInput.tags,
      assigned_to: leadInput.assignedTo || 'Alex Rivera',
      notes: leadInput.notes
    };

    const newLead = await api.createLead(dbLead);
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLead = async (id: string, updated: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
    // map frontend camelCase to snake_case if necessary
    await api.updateLead(id, updated);
  };

  const deleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await api.deleteLead(id);
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await api.updateLead(id, { status });
  };

  const addConversationMessage = async (convId: string, msg: { text: string; sender: 'user' | 'ai' | 'agent' }) => {
    // Optimistic
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: msg.sender,
      senderName: user.name,
      text: msg.text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, tempMsg] } : c))
    );
    
    await api.addMessage(convId, { text: msg.text, sender: msg.sender });
    // Realtime subscription will re-fetch and replace the temp message
  };

  const toggleHumanTakeover = async (convId: string) => {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, humanTakeover: !c.humanTakeover } : c)));
    await api.toggleHumanTakeover(convId, !conv.humanTakeover);
  };

  const deleteConversation = async (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    await api.deleteConversation(convId);
  };

  const addScheduledMessage = async (msg: Omit<ScheduledMessage, 'id'>) => {
    const newSm = await api.createScheduled(msg);
    setScheduledMessages((prev) => [newSm, ...prev]);
  };

  const updateScheduledMessageStatus = async (id: string, status: ScheduledMessage['status']) => {
    setScheduledMessages((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    await api.updateScheduled(id, { status });
  };

  const deleteScheduledMessage = async (id: string) => {
    setScheduledMessages((prev) => prev.filter((s) => s.id !== id));
    await api.deleteScheduled(id);
  };

  const addTemplate = async (template: Omit<MessageTemplate, 'id' | 'lastModified'>) => {
    const newT = await api.createTemplate(template);
    setTemplates((prev) => [newT, ...prev]);
  };

  const updateTemplate = async (id: string, updated: Partial<MessageTemplate>) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    await api.updateTemplate(id, updated);
  };

  const deleteTemplate = async (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    await api.deleteTemplate(id);
  };

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    const newC = await api.createContact(contact);
    setContacts((prev) => [newC, ...prev]);
  };

  const updateContact = async (id: string, updated: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    await api.updateContact(id, updated);
  };

  const deleteContact = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    await api.deleteContact(id);
  };

  const convertLeadToContact = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (!contacts.some((c) => c.email === lead.email)) {
      await addContact({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        tags: lead.tags,
        status: lead.status,
        totalMessagesSent: 1,
        lastContacted: new Date().toISOString(),
      });
    }
  };

  const resetToDefaults = () => {
    // Only clears local state, not DB
    setHotThresholdState(85);
    setQuestions([]);
    setLeads([]);
    setConversations([]);
    setScheduledMessages([]);
    setTemplates([]);
    setContacts([]);
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
