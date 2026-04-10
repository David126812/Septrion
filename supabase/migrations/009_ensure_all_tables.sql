-- Migration 009: Ensure ALL tables and columns exist for Septrion MVP
-- Run this in Supabase SQL Editor if tables are missing or incomplete

-- ============================================
-- 1. Core tables
-- ============================================

CREATE TABLE IF NOT EXISTS public.coproprietes (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  lots_count integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  copro_id text REFERENCES public.coproprietes(id),
  whatsapp_phone text NOT NULL DEFAULT '',
  email text,
  notification_consent boolean NOT NULL DEFAULT false,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dossiers (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  copro_id text REFERENCES public.coproprietes(id),
  name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'en_cours',
  urgency text NOT NULL DEFAULT 'normal',
  description text,
  next_step text,
  last_action text,
  timeline jsonb DEFAULT '[]'::jsonb,
  blocage_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.signalements (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  copro_id text REFERENCES public.coproprietes(id),
  name text NOT NULL DEFAULT '',
  urgency text NOT NULL DEFAULT 'normal',
  location text,
  summary text,
  next_step text,
  document_url text,
  raw_analysis jsonb,
  status text NOT NULL DEFAULT 'nouveau',
  dossier_id text REFERENCES public.dossiers(id),
  sender_name text,
  sender_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.published_updates (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  copro_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 2. Add missing columns (safe with IF NOT EXISTS)
-- ============================================

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN copro_id text REFERENCES public.coproprietes(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN description text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN next_step text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN last_action text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN timeline jsonb DEFAULT '[]'::jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN blocage_reason text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.dossiers ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN copro_id text REFERENCES public.coproprietes(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN location text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN summary text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN next_step text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN document_url text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN raw_analysis jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN dossier_id text REFERENCES public.dossiers(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN sender_name text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.signalements ADD COLUMN sender_phone text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.published_updates ADD COLUMN copro_id text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ============================================
-- 3. Enable RLS on all tables
-- ============================================

ALTER TABLE public.coproprietes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signalements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_updates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS Policies (drop + recreate to be idempotent)
-- ============================================

-- Coproprietes
DROP POLICY IF EXISTS "Authenticated users read coproprietes" ON public.coproprietes;
DROP POLICY IF EXISTS "Authenticated users create coproprietes" ON public.coproprietes;
DROP POLICY IF EXISTS "Allow all for POC" ON public.coproprietes;
CREATE POLICY "Authenticated users read coproprietes" ON public.coproprietes
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users create coproprietes" ON public.coproprietes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Profiles
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for POC" ON public.profiles;
CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Dossiers
DROP POLICY IF EXISTS "Users see own copro dossiers" ON public.dossiers;
DROP POLICY IF EXISTS "Allow all for POC" ON public.dossiers;
CREATE POLICY "Users see own copro dossiers" ON public.dossiers
  FOR ALL USING (
    copro_id = (SELECT copro_id FROM public.profiles WHERE id = auth.uid())
  ) WITH CHECK (
    copro_id = (SELECT copro_id FROM public.profiles WHERE id = auth.uid())
  );

-- Signalements
DROP POLICY IF EXISTS "Users see own copro signalements" ON public.signalements;
DROP POLICY IF EXISTS "Allow all for POC" ON public.signalements;
CREATE POLICY "Users see own copro signalements" ON public.signalements
  FOR ALL USING (
    copro_id = (SELECT copro_id FROM public.profiles WHERE id = auth.uid())
  ) WITH CHECK (
    copro_id = (SELECT copro_id FROM public.profiles WHERE id = auth.uid())
  );

-- Published updates
DROP POLICY IF EXISTS "Users see own copro updates" ON public.published_updates;
DROP POLICY IF EXISTS "Allow all for POC" ON public.published_updates;
CREATE POLICY "Users see own copro updates" ON public.published_updates
  FOR ALL USING (
    copro_id = (SELECT copro_id FROM public.profiles WHERE id = auth.uid())
  ) WITH CHECK (
    copro_id = (SELECT copro_id FROM public.profiles WHERE id = auth.uid())
  );

-- ============================================
-- 5. Storage bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('copro-documents', 'copro-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload/read
DROP POLICY IF EXISTS "Authenticated users manage documents" ON storage.objects;
CREATE POLICY "Authenticated users manage documents" ON storage.objects
  FOR ALL USING (bucket_id = 'copro-documents' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'copro-documents' AND auth.role() = 'authenticated');
