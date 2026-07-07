-- Santa Barbara Chinese Medicine — booking engine schema
create extension if not exists btree_gist with schema extensions;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  duration_min integer not null check (duration_min > 0),
  active boolean not null default true,
  sort_order integer not null default 0
);

create type public.booking_status as enum ('confirmed', 'cancelled', 'completed', 'no_show');
create type public.booking_source as enum ('web', 'admin');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  customer_name text not null,
  customer_phone text not null,
  status public.booking_status not null default 'confirmed',
  source public.booking_source not null default 'web',
  manage_token uuid not null unique default gen_random_uuid(),
  reminder_sid text,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz,
  -- Two confirmed bookings can never overlap, regardless of app-level races.
  constraint bookings_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status = 'confirmed')
);

create index bookings_starts_at_idx on public.bookings (starts_at);

create table public.business_hours (
  weekday smallint primary key check (weekday between 0 and 6), -- 0 = Sunday
  is_open boolean not null default false,
  open_time time not null default '10:30',
  close_time time not null default '17:00',
  check (close_time > open_time)
);

create table public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table public.settings (
  id boolean primary key default true check (id), -- single row
  slot_granularity_min integer not null default 15,
  min_lead_time_min integer not null default 60,
  max_advance_days integer not null default 30,
  shop_name text not null default 'Santa Barbara Chinese Medicine',
  shop_address text not null default '924 Anacapa St, Suite 3D, Santa Barbara, CA 93101',
  shop_phone text not null default '(831) 359-7779',
  timezone text not null default 'America/Los_Angeles'
);

-- When Twilio env vars are absent, SMS payloads land here instead of being sent.
create table public.sms_outbox (
  id uuid primary key default gen_random_uuid(),
  to_phone text not null,
  body text not null,
  send_at timestamptz, -- null = immediate
  kind text not null, -- confirmation | reminder | cancellation
  booking_id uuid references public.bookings (id),
  created_at timestamptz not null default now()
);

-- Server-only access: RLS on with no policies means anon/authenticated see
-- nothing via the Data API; the service role bypasses RLS.
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.business_hours enable row level security;
alter table public.blocked_times enable row level security;
alter table public.settings enable row level security;
alter table public.sms_outbox enable row level security;

-- Seed: services. TODO — neither pricing nor duration is published anywhere
-- (site, Yelp) for this practice. price_cents is seeded at 0 (the homepage
-- shows "Inquire" instead of "$0" and hides duration whenever price_cents is
-- 0) and duration_min holds a placeholder value only, satisfying the > 0
-- check constraint — it is not shown until a real price is set. Update both
-- via /admin/services before launch.
-- Prices are estimated market rate + 10%, rounded up to the nearest $5 for
-- cleaner display, based on comparable Santa Barbara practices (e.g. Santa
-- Barbara Herb Clinic) and national averages per service — a placeholder
-- until Kristen sets her real rates via /admin/services. See CLAUDE.md
-- "Known data gaps".
insert into public.services (name, description, price_cents, duration_min, sort_order) values
  ('Acupuncture', 'Traditional needling therapy to activate and balance the body''s Qi.', 13500, 60, 1),
  ('Herbal Prescriptions', 'Custom tinctures, teas, and pills tailored to your condition.', 10500, 30, 2),
  ('Cupping', 'Suction therapy to relieve muscle tension and improve circulation.', 5500, 30, 3),
  ('Moxibustion', 'Warming herbal therapy to strengthen circulation and immunity.', 5000, 30, 4),
  ('Gua Sha', 'Scraping massage technique to relieve tension and promote healing.', 6000, 30, 5),
  ('Tui Na', 'Traditional Chinese therapeutic massage and bodywork.', 8500, 45, 6),
  ('Reiki', 'Gentle energy healing to promote relaxation and balance.', 9000, 45, 7),
  ('Floral Acupuncture', 'Acupuncture combined with flower essence therapy.', 14500, 60, 8),
  ('Flower Essences', 'Plant-based remedies supporting emotional and energetic balance.', 7000, 30, 9),
  ('Cosmetic Acupuncture', 'Facial acupuncture to support natural skin rejuvenation.', 16500, 60, 10);

-- Seed: hours. TODO — hours aren't published anywhere (site, Yelp checked).
-- Seeded as a normal Mon-Fri 10-6 wellness-practice schedule, closed
-- weekends — Isaac's placeholder per the business owner's instruction, not
-- Kristen's actual hours. Confirm/adjust via /admin/schedule before launch.
insert into public.business_hours (weekday, is_open, open_time, close_time) values
  (0, false, '10:00', '18:00'),
  (1, true,  '10:00', '18:00'),
  (2, true,  '10:00', '18:00'),
  (3, true,  '10:00', '18:00'),
  (4, true,  '10:00', '18:00'),
  (5, true,  '10:00', '18:00'),
  (6, false, '10:00', '18:00');

insert into public.settings default values;
