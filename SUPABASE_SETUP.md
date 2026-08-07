# Supabase Setup Guide

This guide will walk you through setting up a Supabase project for the Skybridge CRM application.

## 1. Create a Supabase Project
1. Go to [database.new](https://database.new) to create a new Supabase project.
2. Enter your Organization, Project Name, and a strong Database Password.
3. Select your region and click **Create new project**. It will take a few minutes for the database to provision.

## 2. Apply the Database Schema
Once your project is ready, you need to apply the database schema.
1. Go to the **SQL Editor** in the Supabase Dashboard (left sidebar).
2. Click **New Query**.
3. Copy the contents of the `supabase/migrations/00001_initial_schema.sql` file in this repository.
4. Paste it into the SQL Editor and click **Run** (or press Cmd/Ctrl+Enter).
5. You should see a "Success" message, meaning your tables, Row Level Security (RLS) policies, and Realtime publications are created.

## 3. Get Your API Keys
1. Go to **Project Settings** (the cog icon in the bottom left).
2. Click on **API** under Configuration.
3. Under **Project URL**, copy the URL. This is your `SUPABASE_URL`.
4. Under **Project API keys**, copy the `anon` `public` key. This is your `SUPABASE_ANON_KEY`.
5. Under **Project API keys**, copy the `service_role` `secret` key. This is your `SUPABASE_SERVICE_ROLE_KEY`.

## 4. Setup Local Environment Variables

### Frontend (`.env`)
Create a `.env` file at the root of the project (next to `vite.config.ts`) and add:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Backend (`backend/.env`)
Create a `.env` file inside the `backend/` directory and add:
```env
PORT=3001
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```
*(Never share your service_role key with the frontend)*

## 5. Enable Email/Password Auth (Optional but Recommended)
1. Go to **Authentication** > **Providers**.
2. **Email** is enabled by default. If you want to disable email confirmations for testing, open the Email provider settings and uncheck "Confirm email".

Your Supabase backend is now configured!
