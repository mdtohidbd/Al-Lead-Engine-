import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Warning: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  realtime: {
    transport: WebSocket as any
  }
});

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Auth Middleware to verify Supabase JWT
export const verifyAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach user object to request
  (req as any).user = user;
  next();
};

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    // Perform a simple query to check the Supabase connection
    const { data, error } = await supabase.from('company_config').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return res.status(500).json({ status: 'error', message: 'Database connection failed', details: error.message });
    }

    res.status(200).json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

import leadsRouter from './routes/leads';
import conversationsRouter from './routes/conversations';
import questionsRouter from './routes/questions';
import templatesRouter from './routes/templates';
import scheduledRouter from './routes/scheduled';
import contactsRouter from './routes/contacts';
import settingsRouter from './routes/settings';
import webhookRouter from './routes/webhook';

// Example Protected Route
app.get('/api/protected', verifyAuth, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!', user: (req as any).user });
});

// API Routes
app.use('/api/v1/leads', verifyAuth, leadsRouter);
app.use('/api/v1/conversations', verifyAuth, conversationsRouter);
app.use('/api/v1/questions', verifyAuth, questionsRouter);
app.use('/api/v1/templates', verifyAuth, templatesRouter);
app.use('/api/v1/scheduled', verifyAuth, scheduledRouter);
app.use('/api/v1/contacts', verifyAuth, contactsRouter);
app.use('/api/v1/settings', verifyAuth, settingsRouter);

// Webhook Routes (No Auth Middleware - verified via Meta token)
app.use('/api/v1/webhook/whatsapp', webhookRouter);

// Start Server
app.listen(port, () => {
  console.log(`Skybridge CRM Backend is running on port ${port}`);
});
