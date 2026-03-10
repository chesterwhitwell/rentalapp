create extension if not exists pgcrypto;

create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, user_id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  active_organisation_id uuid references public.organisations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  address_line_1 text,
  address_line_2 text,
  suburb text,
  city text,
  postcode text,
  country text not null default 'New Zealand',
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.obligations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  category text not null,
  frequency text not null check (frequency in ('weekly','fortnightly','monthly','quarterly','annually')),
  amount numeric(12,2) not null,
  next_due_date date not null,
  autopost_to_ledger boolean not null default false,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  obligation_id uuid references public.obligations(id) on delete set null,
  type text not null check (type in ('income','expense')),
  category text not null,
  transaction_date date not null,
  description text,
  amount numeric(12,2) not null check (amount >= 0),
  tax_year text not null,
  source text not null check (source in ('manual','obligation','csv_import')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  transaction_id uuid references public.transactions(id) on delete set null,
  obligation_id uuid references public.obligations(id) on delete set null,
  file_name text not null,
  file_path text not null,
  mime_type text not null,
  size_bytes bigint not null,
  document_type text not null,
  issue_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_organisation_members_user on public.organisation_members(user_id);
create index if not exists idx_properties_org on public.properties(organisation_id);
create index if not exists idx_obligations_org on public.obligations(organisation_id);
create index if not exists idx_transactions_org_date on public.transactions(organisation_id, transaction_date);
create index if not exists idx_documents_org on public.documents(organisation_id);

create or replace function public.is_member(org_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.organisation_members
    where organisation_id = org_id and user_id = auth.uid()
  );
$$;

create or replace function public.member_role(org_id uuid)
returns text
language sql
stable
security definer
as $$
  select role from public.organisation_members
  where organisation_id = org_id and user_id = auth.uid()
  limit 1;
$$;

alter table public.organisations enable row level security;
alter table public.organisation_members enable row level security;
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.obligations enable row level security;
alter table public.transactions enable row level security;
alter table public.documents enable row level security;

create policy "organisations_select_member" on public.organisations
for select using (public.is_member(id));
create policy "organisations_insert_owner" on public.organisations
for insert with check (auth.uid() is not null);
create policy "organisations_update_owner" on public.organisations
for update using (public.member_role(id) = 'owner') with check (public.member_role(id) = 'owner');

create policy "members_select_member" on public.organisation_members
for select using (public.is_member(organisation_id));
create policy "members_insert_owner" on public.organisation_members
for insert with check (public.member_role(organisation_id) = 'owner');
create policy "members_update_owner" on public.organisation_members
for update using (public.member_role(organisation_id) = 'owner') with check (public.member_role(organisation_id) = 'owner');
create policy "members_delete_owner" on public.organisation_members
for delete using (public.member_role(organisation_id) = 'owner');

create policy "profiles_select_self" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_upsert_self" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "properties_select_member" on public.properties
for select using (public.is_member(organisation_id));
create policy "properties_write_non_viewer" on public.properties
for all using (public.member_role(organisation_id) in ('owner','manager'))
with check (public.member_role(organisation_id) in ('owner','manager'));

create policy "obligations_select_member" on public.obligations
for select using (public.is_member(organisation_id));
create policy "obligations_write_non_viewer" on public.obligations
for all using (public.member_role(organisation_id) in ('owner','manager'))
with check (public.member_role(organisation_id) in ('owner','manager'));

create policy "transactions_select_member" on public.transactions
for select using (public.is_member(organisation_id));
create policy "transactions_write_non_viewer" on public.transactions
for all using (public.member_role(organisation_id) in ('owner','manager'))
with check (public.member_role(organisation_id) in ('owner','manager'));

create policy "documents_select_member" on public.documents
for select using (public.is_member(organisation_id));
create policy "documents_write_non_viewer" on public.documents
for all using (public.member_role(organisation_id) in ('owner','manager'))
with check (public.member_role(organisation_id) in ('owner','manager'));
