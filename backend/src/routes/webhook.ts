import { Router } from 'express';
import { supabase } from '../index';
import { generateAiReply } from '../services/ai';
import { sendWhatsAppMessage } from '../services/whatsapp';

const router = Router();

// GET endpoint for Meta Webhook Verification
router.get('/', async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  try {
    const { data: config, error } = await supabase.from('company_config').select('meta_verify_token').limit(1).single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Database error fetching config:', error);
      return res.sendStatus(500);
    }

    if (!config || !config.meta_verify_token) {
      return res.status(400).send('Webhook not configured in database. Please set meta_verify_token.');
    }

    if (mode && token) {
      if (mode === 'subscribe' && token === config.meta_verify_token) {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
    
    return res.status(400).send('Missing hub.mode or hub.verify_token');
  } catch (err) {
    console.error('Webhook verification error:', err);
    return res.sendStatus(500);
  }
});

// POST endpoint for handling inbound WhatsApp messages
router.post('/', async (req, res) => {
  const body = req.body;

  // Check if this is an event from a page subscription
  if (body.object === 'whatsapp_business_account') {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
      const contact = body.entry[0].changes[0].value.contacts[0];
      const message = body.entry[0].changes[0].value.messages[0];

      const fromPhone = message.from; // Sender's phone number
      const senderName = contact?.profile?.name || 'Unknown';
      const msgText = message.text?.body;

      if (!msgText) {
        return res.sendStatus(200); // Ignore non-text messages for now
      }

      console.log(`Received message from ${fromPhone}: ${msgText}`);

      try {
        // 1. Fetch Company Config
        const { data: config } = await supabase.from('company_config').select('*').limit(1).single();
        if (!config) throw new Error('Missing company config');

        // 2. Find or Create Lead
        let { data: lead } = await supabase.from('leads').select('*').eq('phone', fromPhone).single();
        
        if (!lead) {
          // Create new lead
          const { data: newLead, error: leadErr } = await supabase.from('leads').insert([{
            name: senderName,
            phone: fromPhone,
            status: 'New'
          }]).select().single();
          
          if (leadErr) throw leadErr;
          lead = newLead;
        }

        // 3. Find or Create Conversation
        let { data: conversation } = await supabase.from('conversations').select('*').eq('lead_id', lead.id).single();

        if (!conversation) {
          const { data: newConv, error: convErr } = await supabase.from('conversations').insert([{
            lead_id: lead.id,
            unread_count: 0,
            human_takeover: false
          }]).select().single();
          
          if (convErr) throw convErr;
          conversation = newConv;
        }

        // 4. Save incoming message
        await supabase.from('messages').insert([{
          conversation_id: conversation.id,
          sender: 'user',
          sender_name: senderName,
          text: msgText
        }]);

        // 5. Update Conversation last_message_time
        await supabase.from('conversations').update({ last_message_time: new Date().toISOString() }).eq('id', conversation.id);

        // 6. Generate AI Reply (if not human takeover)
        if (!conversation.human_takeover) {
          const aiReplyText = await generateAiReply(conversation.id, lead.id);
          
          if (aiReplyText) {
            // Save AI reply to DB
            await supabase.from('messages').insert([{
              conversation_id: conversation.id,
              sender: 'ai',
              sender_name: 'AI Agent',
              text: aiReplyText
            }]);

            // Send via WhatsApp
            if (config.meta_whatsapp_token && config.meta_phone_number_id) {
              await sendWhatsAppMessage(
                fromPhone,
                aiReplyText,
                config.meta_phone_number_id,
                config.meta_whatsapp_token
              );
            } else {
              console.warn('Missing WhatsApp API credentials in company_config. Did not send actual WhatsApp message.');
            }
          }
        }

      } catch (err) {
        console.error('Error processing webhook event:', err);
      }
    }
    
    // Return a 200 OK to acknowledge receipt
    res.sendStatus(200);
  } else {
    // Return a 404 if the event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

export default router;
