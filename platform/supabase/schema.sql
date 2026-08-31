-- ============================================================================
-- CWG load booking platform — database schema
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: every statement is idempotent.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------- enums ----
do $$ begin
  create type verification_status as enum ('unverified','under_review','verified','suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('pending','approved','declined','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type load_status as enum ('open','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_status as enum ('missing','pending','verified','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('transporter','admin');
exception when duplicate_object then null; end $$;

-- --------------------------------------------------------- transporters ----
create table if not exists transporters (
  id                uuid primary key default uuid_generate_v4(),
  company           text not null,
  reg_no            text,
  contact_person    text not null,
  phone             text not null,
  email             text not null,
  base_location     text not null,
  fleet_size        int  not null default 0 check (fleet_size >= 0),
  git_cover         bigint,
  truck_types       text[] not null default '{}',
  verification      verification_status not null default 'unverified',
  admin_note        text,
  created_at        timestamptz not null default now()
);

-- ------------------------------------------------------------- profiles ----
-- One row per authenticated user. Transporter users point at their company.
create table if not exists profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  role           user_role not null default 'transporter',
  transporter_id uuid references transporters(id) on delete set null,
  full_name      text,
  created_at     timestamptz not null default now()
);

-- Read the caller's role without tripping RLS recursion on profiles.
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create or replace function my_transporter_id()
returns uuid language sql stable security definer set search_path = public as $$
  select p.transporter_id from profiles p where p.id = auth.uid();
$$;

-- ---------------------------------------------------------------- loads ----
create sequence if not exists load_ref_seq start 2100;

create table if not exists loads (
  id             uuid primary key default uuid_generate_v4(),
  ref            text unique not null default 'LD-' || nextval('load_ref_seq'),
  from_town      text not null,
  from_province  text not null,
  to_town        text not null,
  to_province    text not null,
  commodity      text not null,
  tonnage        numeric(6,2) not null check (tonnage > 0),
  loading_date   date not null,
  km             int not null check (km > 0),
  rate_per_ton   numeric(10,2) not null check (rate_per_ton > 0),
  trucks_total   int not null check (trucks_total > 0),
  notes          text,
  status         load_status not null default 'open',
  created_by     uuid references auth.users(id),
  created_at     timestamptz not null default now()
);

create index if not exists loads_status_date_idx on loads (status, loading_date);

-- ------------------------------------------------------------- bookings ----
create sequence if not exists booking_ref_seq start 3300;

create table if not exists bookings (
  id             uuid primary key default uuid_generate_v4(),
  ref            text unique not null default 'BK-' || nextval('booking_ref_seq'),
  load_id        uuid not null references loads(id) on delete cascade,
  transporter_id uuid not null references transporters(id) on delete cascade,
  trucks         int not null check (trucks > 0),
  note           text,
  status         booking_status not null default 'pending',
  created_at     timestamptz not null default now(),
  decided_at     timestamptz,
  decided_by     uuid references auth.users(id),
  -- one live request per carrier per load; a declined one may be re-submitted
  unique (load_id, transporter_id)
);

create index if not exists bookings_transporter_idx on bookings (transporter_id, created_at desc);
create index if not exists bookings_status_idx on bookings (status, created_at desc);

-- ------------------------------------------------------------ documents ----
create table if not exists documents (
  id             uuid primary key default uuid_generate_v4(),
  transporter_id uuid not null references transporters(id) on delete cascade,
  doc_type       text not null,   -- git_insurance | operating_licence | tax_clearance | roadworthy
  storage_path   text,
  status         document_status not null default 'missing',
  expires_at     date,
  admin_note     text,
  uploaded_at    timestamptz,
  unique (transporter_id, doc_type)
);

-- ------------------------------------------------- trucks-remaining view ----
-- Only approved bookings consume capacity.
create or replace view load_availability as
  select l.id as load_id,
         l.trucks_total,
         coalesce(sum(b.trucks) filter (where b.status = 'approved'), 0)::int as trucks_taken,
         l.trucks_total - coalesce(sum(b.trucks) filter (where b.status = 'approved'), 0)::int as trucks_remaining
  from loads l
  left join bookings b on b.load_id = l.id
  group by l.id, l.trucks_total;

-- Refuse an approval that would oversell the load.
create or replace function enforce_truck_capacity()
returns trigger language plpgsql as $$
declare remaining int;
begin
  if new.status = 'approved' and (tg_op = 'INSERT' or old.status is distinct from 'approved') then
    select trucks_remaining into remaining from load_availability where load_id = new.load_id;
    if remaining < new.trucks then
      raise exception 'Only % truck(s) still open on this load', remaining;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists bookings_capacity on bookings;
create trigger bookings_capacity before insert or update on bookings
  for each row execute function enforce_truck_capacity();

-- =============================== ROW LEVEL SECURITY =========================
alter table transporters enable row level security;
alter table profiles     enable row level security;
alter table loads        enable row level security;
alter table bookings     enable row level security;
alter table documents    enable row level security;

-- profiles: you read/update yourself; admins read all
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles for select
  using (id = auth.uid() or is_admin());
drop policy if exists profiles_self_write on profiles;
create policy profiles_self_write on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_insert_self on profiles;
create policy profiles_insert_self on profiles for insert
  with check (id = auth.uid());

-- transporters: your own company, or admins
drop policy if exists transporters_read on transporters;
create policy transporters_read on transporters for select
  using (id = my_transporter_id() or is_admin());
drop policy if exists transporters_insert on transporters;
create policy transporters_insert on transporters for insert
  with check (auth.uid() is not null);
drop policy if exists transporters_update on transporters;
create policy transporters_update on transporters for update
  using (id = my_transporter_id() or is_admin())
  with check (id = my_transporter_id() or is_admin());

-- loads: any signed-in user sees open loads; only admins write
drop policy if exists loads_read on loads;
create policy loads_read on loads for select
  using (status = 'open' or is_admin());
drop policy if exists loads_admin_write on loads;
create policy loads_admin_write on loads for all
  using (is_admin()) with check (is_admin());

-- bookings: carriers see and create their own; admins see and decide all
drop policy if exists bookings_read on bookings;
create policy bookings_read on bookings for select
  using (transporter_id = my_transporter_id() or is_admin());
drop policy if exists bookings_insert on bookings;
create policy bookings_insert on bookings for insert
  with check (transporter_id = my_transporter_id() and status = 'pending');
drop policy if exists bookings_admin_update on bookings;
create policy bookings_admin_update on bookings for update
  using (is_admin()) with check (is_admin());
drop policy if exists bookings_owner_cancel on bookings;
create policy bookings_owner_cancel on bookings for update
  using (transporter_id = my_transporter_id() and status = 'pending')
  with check (transporter_id = my_transporter_id() and status = 'cancelled');

-- documents: your own, or admins
drop policy if exists documents_read on documents;
create policy documents_read on documents for select
  using (transporter_id = my_transporter_id() or is_admin());
drop policy if exists documents_write on documents;
create policy documents_write on documents for all
  using (transporter_id = my_transporter_id() or is_admin())
  with check (transporter_id = my_transporter_id() or is_admin());

-- ------------------------------------------------- compliance docs bucket ---
insert into storage.buckets (id, name, public)
  values ('compliance', 'compliance', false)
  on conflict (id) do nothing;

drop policy if exists compliance_owner_rw on storage.objects;
create policy compliance_owner_rw on storage.objects for all
  using (
    bucket_id = 'compliance'
    and (is_admin() or (storage.foldername(name))[1] = my_transporter_id()::text)
  )
  with check (
    bucket_id = 'compliance'
    and (is_admin() or (storage.foldername(name))[1] = my_transporter_id()::text)
  );
