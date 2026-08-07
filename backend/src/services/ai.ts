import { supabase } from '../index';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateAiReply(conversationId: string, leadId: string) {
  console.log(`[AI-DEBUG] generateAiReply called — conv=${conversationId} lead=${leadId}`);

  // 1. Fetch company config
  const { data: config, error: configError } = await supabase
    .from('company_config')
    .select('*')
    .limit(1)
    .single();

  if (configError) {
    console.error('[AI-DEBUG] Failed to fetch company_config:', configError);
    return null;
  }

  console.log(`[AI-DEBUG] config loaded — ai_provider='${config.ai_provider}' ai_active=${config.ai_active}`);

  // Feature Flag Kill Switch - only block if EXPLICITLY set to false
  if (config.ai_active === false) {
    console.log('[AI-DEBUG] BLOCKED: ai_active is false.');
    return null;
  }

  // 2. Fetch conversation history
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true })
    .limit(20);

  if (msgError) {
    console.error('[AI-DEBUG] Failed to fetch messages:', msgError);
    return null;
  }

  console.log(`[AI-DEBUG] ${messages?.length ?? 0} messages fetched for conversation`);

  if (!messages || messages.length === 0) {
    console.warn('[AI-DEBUG] BLOCKED: No messages found — nothing to reply to.');
    return null;
  }

  // 3. Fetch qualification questions
  const { data: questions, error: qError } = await supabase
    .from('qualification_questions')
    .select('*');

  if (qError) {
    console.error('[AI-DEBUG] Failed to fetch questions:', qError);
    return null;
  }

  const systemPrompt = config.ai_system_prompt || `You are an AI assistant qualifying leads for ${config.business_name} in the ${config.industry} industry. Your goal is to be helpful and seamlessly extract qualification information during the conversation.`;

  // Format messages for the AI provider
  // Simple mapping: 'user' -> user, 'ai'/'agent' -> assistant
  const allFormatted = messages.map((m: any) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));

  // Ensure history starts with a user message (Gemini and Anthropic requirement)
  const firstUserIdx = allFormatted.findIndex((m: any) => m.role === 'user');
  const formattedMessages = firstUserIdx > 0 ? allFormatted.slice(firstUserIdx) : allFormatted;

  console.log(`[AI-DEBUG] formattedMessages count=${formattedMessages.length}, last role='${formattedMessages[formattedMessages.length - 1]?.role}'`);

  let aiReplyText = '';

  try {
    if (config.ai_provider === 'claude') {
      console.log('[AI-DEBUG] Calling Anthropic Claude...');
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || '',
      });

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: formattedMessages as any,
      });

      if (response.content && response.content[0] && response.content[0].type === 'text') {
        aiReplyText = response.content[0].text;
      }

    } else if (config.ai_provider === 'gemini') {
      console.log('[AI-DEBUG] Calling Google Gemini...');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt 
      });

      // Gemini history = all messages except the last one (which is the new user message)
      const history = formattedMessages.slice(0, -1).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({ history });
      const lastMessage = formattedMessages[formattedMessages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      aiReplyText = result.response.text();

    } else {
      console.warn(`[AI-DEBUG] BLOCKED: Unsupported ai_provider='${config.ai_provider}'. Must be 'claude' or 'gemini'.`);
      return null;
    }

    console.log(`[AI-DEBUG] AI reply generated (${aiReplyText.length} chars)`);
    return aiReplyText;

  } catch (error) {
    console.error(`[AI-DEBUG] ERROR generating reply with provider='${config.ai_provider}':`, error);
    return null;
  }
}
