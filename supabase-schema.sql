-- =========================================================================
-- VESNA / DAWATNAMA DIGITAL INVITATION ATELIER - SUPABASE DATABASE SCHEMA
-- =========================================================================

-- 1. Create Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
  id TEXT PRIMARY KEY,                       -- e.g. 'inv_fatima_sharjeel'
  template_id TEXT NOT NULL,                 -- e.g. 'royal-burgundy', 'noor-walima', etc.
  title TEXT NOT NULL,                       -- e.g. 'Fatima & Sharjeel Wedding'
  event_type TEXT NOT NULL,                  -- 'nikkah' | 'walima' | 'mehndi' | 'birthday' | 'anniversary'
  status TEXT NOT NULL DEFAULT 'draft',      -- 'draft' | 'pending_payment' | 'published' | 'archived'
  
  -- Personalized content stored as JSONB for ultimate flexibility across templates
  data JSONB NOT NULL,
  
  -- Uploaded image URLs and references
  media JSONB DEFAULT '{}'::jsonb,
  
  -- Creator / ownership tracking
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_passcode TEXT,                       -- Optional guest PIN or edit key
  
  -- Views & RSVP counts
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 2. Create RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id TEXT REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  attendance TEXT NOT NULL,                  -- 'attending' | 'declined' | 'tentative'
  guest_count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table (Mode A Payments)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,                       -- e.g. 'ord_9821'
  invitation_id TEXT REFERENCES public.invitations(id) ON DELETE CASCADE,
  couple_name TEXT NOT NULL,
  amount NUMERIC DEFAULT 6500,
  payment_method TEXT NOT NULL,              -- 'easypaisa' | 'jazzcash' | 'bank_transfer'
  trx_id TEXT NOT NULL,
  sender_name TEXT,
  sender_account TEXT,
  slip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',    -- 'pending' | 'verified' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 4. Create Custom Templates Table (Super Admin Bespoke Suites)
CREATE TABLE IF NOT EXISTS public.custom_templates (
  id TEXT PRIMARY KEY,                       -- e.g. 'suite-royal-velvet-2981'
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  description TEXT,
  badge TEXT DEFAULT 'Atelier Bespoke Edition',
  palette JSONB NOT NULL DEFAULT '["#26060A", "#D4AF37", "#FAF5EF"]'::jsonb,
  theme_style TEXT DEFAULT 'royal-arch',
  thumbnail TEXT,
  slots JSONB DEFAULT '{}'::jsonb,
  sample_data JSONB DEFAULT '{}'::jsonb,
  is_custom BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- Invitations Policies
CREATE POLICY "Public can view published invitations"
ON public.invitations FOR SELECT
USING (status = 'published');

CREATE POLICY "Anyone can create invitations"
ON public.invitations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update invitations"
ON public.invitations FOR UPDATE
USING (true);

-- RSVPs Policies
CREATE POLICY "Anyone can submit RSVP"
ON public.rsvps FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view RSVPs"
ON public.rsvps FOR SELECT
USING (true);

-- Orders Policies
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
ON public.orders FOR SELECT
USING (true);

CREATE POLICY "Anyone can update orders"
ON public.orders FOR UPDATE
USING (true);

-- Custom Templates Policies
CREATE POLICY "Public can view custom templates"
ON public.custom_templates FOR SELECT
USING (true);

CREATE POLICY "Anyone can create custom templates"
ON public.custom_templates FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update custom templates"
ON public.custom_templates FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete custom templates"
ON public.custom_templates FOR DELETE
USING (true);

-- 6. Storage Bucket Setup (for guest & host picture uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('invitation-assets', 'invitation-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'invitation-assets');

CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'invitation-assets');
