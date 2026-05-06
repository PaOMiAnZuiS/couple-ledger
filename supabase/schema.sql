create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '我',
  avatar_url text,
  default_space_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_spaces (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'family' check (type in ('personal', 'family', 'goal')),
  invite_code text unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (owner_id, client_id)
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member', 'readonly')),
  display_name text not null default '成员',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, user_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  client_id text not null,
  name text not null,
  type text not null check (type in ('expense', 'income', 'transfer')),
  icon text not null default '',
  color text not null default '#6EE7B7',
  budget numeric(14, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (space_id, client_id)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  client_id text not null,
  name text not null,
  kind text not null check (kind in ('asset', 'liability')),
  balance numeric(14, 2) not null default 0,
  currency text not null default 'CNY',
  icon text not null default '账',
  color text not null default '#6EE7B7',
  due_day smallint check (due_day is null or due_day between 1 and 31),
  credit_limit numeric(14, 2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (space_id, client_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  client_id text not null,
  title text not null,
  target_amount numeric(14, 2) not null check (target_amount >= 0),
  due_on date,
  icon text not null default 'goal',
  color text not null default '#F6D889',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (space_id, client_id)
);

create table if not exists public.goal_accounts (
  goal_id uuid not null references public.goals(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (goal_id, account_id)
);

create table if not exists public.income_plans (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  payday smallint not null default 10 check (payday between 1 and 28),
  salary numeric(14, 2) not null default 0,
  side_target numeric(14, 2) not null default 0,
  saving_target numeric(14, 2) not null default 0,
  side_names text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id)
);

create table if not exists public.recurring_rules (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  client_id text not null,
  title text not null,
  category_id uuid references public.categories(id),
  account_id uuid references public.accounts(id),
  amount numeric(14, 2) not null default 0,
  cycle text not null,
  next_on date not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (space_id, client_id)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  client_id text not null,
  account_id uuid references public.accounts(id),
  account_client_id text,
  category_id uuid references public.categories(id),
  category_client_id text,
  type text not null check (type in ('expense', 'income', 'transfer')),
  title text not null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null default 'CNY',
  occurred_on date not null,
  member_user_id uuid references auth.users(id),
  member_name text not null default '',
  payer_name text not null default '',
  owner_name text not null default '',
  is_advance boolean not null default false,
  settlement_status text not null default '',
  note text not null default '',
  tags text[] not null default '{}'::text[],
  receipt_url text not null default '',
  source text not null default 'manual',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (space_id, client_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.asset_spaces(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists memberships_user_idx on public.memberships(user_id);
create index if not exists accounts_space_active_idx on public.accounts(space_id) where deleted_at is null;
create index if not exists transactions_space_date_idx on public.transactions(space_id, occurred_on desc) where deleted_at is null;
create index if not exists transactions_account_idx on public.transactions(account_id) where deleted_at is null;
create index if not exists goals_space_active_idx on public.goals(space_id) where deleted_at is null;
create index if not exists recurring_rules_space_active_idx on public.recurring_rules(space_id) where deleted_at is null;

create or replace function public.is_space_member(target_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where space_id = target_space_id
      and user_id = auth.uid()
      and role in ('admin', 'member', 'readonly')
  );
$$;

create or replace function public.can_manage_space(target_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where space_id = target_space_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.can_write_space(target_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where space_id = target_space_id
      and user_id = auth.uid()
      and role in ('admin', 'member')
  );
$$;

create or replace function public.add_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.memberships (space_id, user_id, role, display_name)
  values (new.id, new.owner_id, 'admin', '我')
  on conflict (space_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists add_owner_membership_trigger on public.asset_spaces;
create trigger add_owner_membership_trigger
after insert on public.asset_spaces
for each row execute function public.add_owner_membership();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'asset_spaces',
    'memberships',
    'categories',
    'accounts',
    'goals',
    'goal_accounts',
    'income_plans',
    'recurring_rules',
    'transactions',
    'audit_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
on public.profiles for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "spaces_select_member" on public.asset_spaces;
create policy "spaces_select_member"
on public.asset_spaces for select
to authenticated
using (public.is_space_member(id));

drop policy if exists "spaces_insert_owner" on public.asset_spaces;
create policy "spaces_insert_owner"
on public.asset_spaces for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "spaces_update_admin" on public.asset_spaces;
create policy "spaces_update_admin"
on public.asset_spaces for update
to authenticated
using (public.can_manage_space(id))
with check (public.can_manage_space(id));

drop policy if exists "memberships_select_member" on public.memberships;
create policy "memberships_select_member"
on public.memberships for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "memberships_insert_admin" on public.memberships;
create policy "memberships_insert_admin"
on public.memberships for insert
to authenticated
with check (public.can_manage_space(space_id));

drop policy if exists "memberships_update_admin" on public.memberships;
create policy "memberships_update_admin"
on public.memberships for update
to authenticated
using (public.can_manage_space(space_id))
with check (public.can_manage_space(space_id));

drop policy if exists "memberships_delete_admin" on public.memberships;
create policy "memberships_delete_admin"
on public.memberships for delete
to authenticated
using (public.can_manage_space(space_id));

drop policy if exists "categories_read_member" on public.categories;
create policy "categories_read_member"
on public.categories for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "categories_manage_admin" on public.categories;
create policy "categories_manage_admin"
on public.categories for all
to authenticated
using (public.can_manage_space(space_id))
with check (public.can_manage_space(space_id));

drop policy if exists "accounts_read_member" on public.accounts;
create policy "accounts_read_member"
on public.accounts for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "accounts_manage_admin" on public.accounts;
create policy "accounts_manage_admin"
on public.accounts for all
to authenticated
using (public.can_manage_space(space_id))
with check (public.can_manage_space(space_id));

drop policy if exists "goals_read_member" on public.goals;
create policy "goals_read_member"
on public.goals for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "goals_manage_admin" on public.goals;
create policy "goals_manage_admin"
on public.goals for all
to authenticated
using (public.can_manage_space(space_id))
with check (public.can_manage_space(space_id));

drop policy if exists "goal_accounts_read_member" on public.goal_accounts;
create policy "goal_accounts_read_member"
on public.goal_accounts for select
to authenticated
using (
  exists (
    select 1 from public.goals
    where goals.id = goal_accounts.goal_id
      and public.is_space_member(goals.space_id)
  )
);

drop policy if exists "goal_accounts_manage_admin" on public.goal_accounts;
create policy "goal_accounts_manage_admin"
on public.goal_accounts for all
to authenticated
using (
  exists (
    select 1 from public.goals
    where goals.id = goal_accounts.goal_id
      and public.can_manage_space(goals.space_id)
  )
)
with check (
  exists (
    select 1 from public.goals
    where goals.id = goal_accounts.goal_id
      and public.can_manage_space(goals.space_id)
  )
);

drop policy if exists "income_plans_read_member" on public.income_plans;
create policy "income_plans_read_member"
on public.income_plans for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "income_plans_manage_admin" on public.income_plans;
create policy "income_plans_manage_admin"
on public.income_plans for all
to authenticated
using (public.can_manage_space(space_id))
with check (public.can_manage_space(space_id));

drop policy if exists "recurring_rules_read_member" on public.recurring_rules;
create policy "recurring_rules_read_member"
on public.recurring_rules for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "recurring_rules_manage_admin" on public.recurring_rules;
create policy "recurring_rules_manage_admin"
on public.recurring_rules for all
to authenticated
using (public.can_manage_space(space_id))
with check (public.can_manage_space(space_id));

drop policy if exists "transactions_read_member" on public.transactions;
create policy "transactions_read_member"
on public.transactions for select
to authenticated
using (public.is_space_member(space_id));

drop policy if exists "transactions_insert_member" on public.transactions;
create policy "transactions_insert_member"
on public.transactions for insert
to authenticated
with check (public.can_write_space(space_id));

drop policy if exists "transactions_update_member_or_admin" on public.transactions;
create policy "transactions_update_member_or_admin"
on public.transactions for update
to authenticated
using (public.can_manage_space(space_id) or created_by = auth.uid())
with check (public.can_write_space(space_id));

drop policy if exists "transactions_delete_member_or_admin" on public.transactions;
create policy "transactions_delete_member_or_admin"
on public.transactions for delete
to authenticated
using (public.can_manage_space(space_id) or created_by = auth.uid());

drop policy if exists "audit_logs_read_admin" on public.audit_logs;
create policy "audit_logs_read_admin"
on public.audit_logs for select
to authenticated
using (public.can_manage_space(space_id));

drop policy if exists "audit_logs_insert_member" on public.audit_logs;
create policy "audit_logs_insert_member"
on public.audit_logs for insert
to authenticated
with check (public.can_write_space(space_id));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'asset_spaces',
    'memberships',
    'categories',
    'accounts',
    'goals',
    'income_plans',
    'recurring_rules',
    'transactions'
  ]
  loop
    execute format('drop trigger if exists set_updated_at_trigger on public.%I', table_name);
    execute format('create trigger set_updated_at_trigger before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end;
$$;
