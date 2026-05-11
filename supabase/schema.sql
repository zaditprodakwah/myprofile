-- 1) Inquiries (Lead Capture)
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  segment text not null check (segment in ('marketing', 'academic', 'business')),
  goal text,
  challenges text,
  urgency text check (urgency in ('today','this_week','this_month','flexible')),
  budget_range text,
  deadline_date date,

  full_name text not null,
  email text,
  whatsapp text,
  company text,
  role text,

  source text,
  campaign text,
  referrer text,
  landing_path text,

  lead_score int default 0,
  lead_tier text,
  routing text,
  status text default 'new' check (status in ('new','contacted','qualified','closed','ignored')),

  notes text
);

create index if not exists idx_inquiries_created_at on inquiries(created_at desc);

-- 2) Events (Analytics)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  session_id text,
  event_name text not null,
  segment text,
  path text,
  referrer text,
  metadata jsonb default '{}'::jsonb
);

-- 3) Radar Items (RSS)
create table if not exists radar_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  source_name text not null,
  title text not null,
  url text not null unique,
  published_at timestamptz,
  summary text,
  tags text[] default '{}'
);

-- 4) Newsletter Subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null unique,
  segment text,
  status text default 'active'
);
