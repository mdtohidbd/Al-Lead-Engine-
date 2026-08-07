import { Router } from 'express';
import { supabase } from '../index';

const router = Router();

// GET all conversations with messages
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .order('last_message_time', { ascending: false });
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE conversation
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('conversations').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST message to a conversation
router.post('/:id/messages', async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      conversation_id: req.params.id,
    };
    const { data, error } = await supabase.from('messages').insert([messageData]).select().single();
    
    if (error) throw error;

    // Update conversation's last_message_time
    await supabase
      .from('conversations')
      .update({ last_message_time: new Date().toISOString() })
      .eq('id', req.params.id);

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT toggle takeover
router.put('/:id/takeover', async (req, res) => {
  try {
    const { humanTakeover } = req.body;
    const { data, error } = await supabase
      .from('conversations')
      .update({ human_takeover: humanTakeover })
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
