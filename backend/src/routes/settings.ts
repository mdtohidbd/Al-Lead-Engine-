import { Router } from 'express';
import { supabase } from '../index';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('company_config').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned

    if (!data) {
      return res.json({});
    }

    // Mask sensitive fields
    const maskedData = {
      ...data,
      meta_whatsapp_token: data.meta_whatsapp_token ? '********' : null,
      meta_verify_token: data.meta_verify_token ? '********' : null,
    };
    
    console.log("GET /settings returns:", maskedData);

    res.json(maskedData);
  } catch (error: any) {
    console.error("GET /settings error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Don't update sensitive fields if they are masked
    if (updateData.meta_whatsapp_token === '********') {
      delete updateData.meta_whatsapp_token;
    }
    if (updateData.meta_verify_token === '********') {
      delete updateData.meta_verify_token;
    }

    // Check if a config row exists
    const { data: existing, error: fetchError } = await supabase.from('company_config').select('id').limit(1).single();
    
    let result;
    if (fetchError && fetchError.code === 'PGRST116') {
      // Insert if doesn't exist
      const insertData = {
        ...updateData,
        business_name: updateData.business_name || 'My Company',
        industry: updateData.industry || 'General',
      };
      const { data, error } = await supabase.from('company_config').insert([insertData]).select().single();
      if (error) throw error;
      result = data;
    } else {
      // Update existing
      const { data, error } = await supabase.from('company_config').update(updateData).eq('id', existing.id).select().single();
      if (error) throw error;
      result = data;
    }

    // Mask before returning
    const maskedData = {
      ...result,
      meta_whatsapp_token: result.meta_whatsapp_token ? '********' : null,
      meta_verify_token: result.meta_verify_token ? '********' : null,
    };

    res.json(maskedData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
