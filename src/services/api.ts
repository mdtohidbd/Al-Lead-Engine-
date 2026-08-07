import axios from 'axios';
import { supabase } from './supabase';
import { Lead, QualificationQuestion, Conversation, ChatMessage, MessageTemplate, ScheduledMessage, Contact } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
});

// Intercept requests to attach Supabase JWT (auto-refreshes if expired)
api.interceptors.request.use(async (config) => {
  // refreshSession() automatically refreshes an expired token using the refresh token
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Intercept 401 responses - try to refresh session and retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !session) {
        // Session is truly dead - sign out so the login page appears
        await supabase.auth.signOut();
        window.location.reload();
        return Promise.reject(error);
      }
      originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

// Leads
export const getLeads = () => api.get<Lead[]>('/leads').then((res) => res.data);
export const createLead = (lead: Partial<Lead>) => api.post<Lead>('/leads', lead).then((res) => res.data);
export const updateLead = (id: string, updates: Partial<Lead>) => api.put<Lead>(`/leads/${id}`, updates).then((res) => res.data);
export const deleteLead = (id: string) => api.delete(`/leads/${id}`);

// Conversations
export const getConversations = () => api.get<Conversation[]>('/conversations').then((res) => res.data);
export const deleteConversation = (id: string) => api.delete(`/conversations/${id}`);
export const toggleHumanTakeover = (id: string, takeover: boolean) => api.put(`/conversations/${id}/takeover`, { humanTakeover: takeover }).then((res) => res.data);
export const addMessage = (conversationId: string, message: { text: string; sender: string }) => api.post<ChatMessage>(`/conversations/${conversationId}/messages`, message).then((res) => res.data);

// Questions
export const getQuestions = () => api.get<QualificationQuestion[]>('/questions').then((res) => res.data);
export const createQuestion = (q: Partial<QualificationQuestion>) => api.post<QualificationQuestion>('/questions', q).then((res) => res.data);
export const updateQuestion = (id: string, updates: Partial<QualificationQuestion>) => api.put<QualificationQuestion>(`/questions/${id}`, updates).then((res) => res.data);
export const deleteQuestion = (id: string) => api.delete(`/questions/${id}`);

// Templates
export const getTemplates = () => api.get<MessageTemplate[]>('/templates').then((res) => res.data);
export const createTemplate = (t: Partial<MessageTemplate>) => api.post<MessageTemplate>('/templates', t).then((res) => res.data);
export const updateTemplate = (id: string, updates: Partial<MessageTemplate>) => api.put<MessageTemplate>(`/templates/${id}`, updates).then((res) => res.data);
export const deleteTemplate = (id: string) => api.delete(`/templates/${id}`);

// Scheduled
export const getScheduled = () => api.get<ScheduledMessage[]>('/scheduled').then((res) => res.data);
export const createScheduled = (sm: Partial<ScheduledMessage>) => api.post<ScheduledMessage>('/scheduled', sm).then((res) => res.data);
export const updateScheduled = (id: string, updates: Partial<ScheduledMessage>) => api.put<ScheduledMessage>(`/scheduled/${id}`, updates).then((res) => res.data);
export const deleteScheduled = (id: string) => api.delete(`/scheduled/${id}`);

// Contacts
export const getContacts = () => api.get<Contact[]>('/contacts').then((res) => res.data);
export const createContact = (c: Partial<Contact>) => api.post<Contact>('/contacts', c).then((res) => res.data);
export const updateContact = (id: string, updates: Partial<Contact>) => api.put<Contact>(`/contacts/${id}`, updates).then((res) => res.data);
export const deleteContact = (id: string) => api.delete(`/contacts/${id}`);

// Settings
export const getSettings = () => api.get('/settings').then((res) => res.data);
export const updateSettings = (updates: any) => api.put('/settings', updates).then((res) => res.data);
