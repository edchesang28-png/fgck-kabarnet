-- ============================================================================
-- FULL GOSPEL CHURCHES OF KENYA — KABARNET
-- Supabase / Postgres schema
-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New Query)
-- ============================================================================

-- Extension for UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. EVENTS  (youth rallies, keshas, conferences, revivals, etc.)
-- ----------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'general'
    check (category in ('general','youth','kesha','conference','revival','crusade','wedding','funeral','training')),
  event_date date not null,
  start_time time,
  end_time time,
  location text default 'FGCK Kabarnet Main Sanctuary',
  flyer_url text,              -- Supabase Storage public URL for the flyer image
  is_featured boolean default false,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_events_date on events (event_date);
create index if not exists idx_events_published on events (is_published);

-- ----------------------------------------------------------------------------
-- 2. ANNOUNCEMENTS  (toggleable top banner)
-- ----------------------------------------------------------------------------
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_url text,               -- optional "Learn more" link
  link_label text default 'Learn more',
  is_active boolean default false,   -- only ONE should be active at a time (enforced in app logic)
  severity text default 'info' check (severity in ('info','urgent','celebration')),
  starts_at timestamptz default now(),
  expires_at timestamptz,      -- optional auto-expiry
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 3. SERMONS  (video / audio / notes)
-- ----------------------------------------------------------------------------
create table if not exists sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null default 'Bishop Cheptarus',
  series text,                 -- e.g. "Faith That Moves Mountains"
  sermon_date date not null,
  scripture_reference text,    -- e.g. "Mark 11:22-24"
  video_url text,              -- YouTube / Vimeo embed link
  audio_url text,              -- podcast / mp3 link
  notes_pdf_url text,          -- Supabase Storage PDF
  thumbnail_url text,
  description text,
  is_published boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_sermons_date on sermons (sermon_date desc);

-- ----------------------------------------------------------------------------
-- 4. SITE SETTINGS  (single-row config table: service times, Bishop's word, etc.)
-- ----------------------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),  -- enforce single row
  bishop_weekly_word text default 'Welcome to Full Gospel Churches of Kenya, Kabarnet.',
  bishop_word_updated_at timestamptz default now(),
  sunday_service_1 text default '8:00 AM – First Service',
  sunday_service_2 text default '10:30 AM – Main Service',
  wednesday_service text default '5:30 PM – Bible Study & Prayer',
  friday_service text default '5:30 PM – Youth Service',
  church_address text default 'FGCK Kabarnet, Baringo County, Kenya',
  church_phone_1 text default '+254 7XX XXX XXX',
  church_phone_2 text,
  church_email text default 'info@fgckkabarnet.org',
  paybill_number text default '000000',
  paybill_account_label text default 'Your Name / Tithe / Offering',
  latitude double precision default 0.4919,
  longitude double precision default 35.7419,
  livestream_url text,
  next_service_datetime timestamptz,   -- drives homepage countdown
  updated_at timestamptz default now()
);

-- Seed the single settings row
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 5. CONTACT MESSAGES  (from the Contact page form)
-- ----------------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 6. ADMIN USERS
-- Admin auth uses Supabase Auth (auth.users) directly — no custom password table.
-- This table just maps an auth.users.id to a role/display name for the dashboard.
-- ----------------------------------------------------------------------------
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'editor' check (role in ('super_admin','editor')),
  created_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public (anon) can READ published content only.
-- Only authenticated admin users can WRITE.
-- ============================================================================

alter table events enable row level security;
alter table announcements enable row level security;
alter table sermons enable row level security;
alter table site_settings enable row level security;
alter table contact_messages enable row level security;
alter table admin_profiles enable row level security;

-- Public read policies
create policy "Public can read published events"
  on events for select using (is_published = true);

create policy "Public can read active announcements"
  on announcements for select using (is_active = true);

create policy "Public can read published sermons"
  on sermons for select using (is_published = true);

create policy "Public can read site settings"
  on site_settings for select using (true);

-- Public insert (contact form only — no read/update/delete for anon)
create policy "Public can submit contact messages"
  on contact_messages for insert with check (true);

-- Authenticated (admin) full access policies
create policy "Admins full access events"
  on events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins full access announcements"
  on announcements for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins full access sermons"
  on sermons for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins full access settings"
  on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins can read contact messages"
  on contact_messages for select using (auth.role() = 'authenticated');

create policy "Admins can update contact messages"
  on contact_messages for update using (auth.role() = 'authenticated');

create policy "Admins can read own profile"
  on admin_profiles for select using (auth.uid() = id);

-- ============================================================================
-- STORAGE BUCKETS (run separately in Supabase Dashboard -> Storage, or via API)
-- Bucket: "flyers"      -> public, for event flyer images
-- Bucket: "sermon-notes" -> public, for PDF sermon notes
-- Bucket: "thumbnails"   -> public, for sermon thumbnail images
-- ============================================================================

-- Trigger to auto-update `updated_at` on events and settings
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_events_updated on events;
create trigger trg_events_updated before update on events
  for each row execute function set_updated_at();

drop trigger if exists trg_settings_updated on site_settings;
create trigger trg_settings_updated before update on site_settings
  for each row execute function set_updated_at();
