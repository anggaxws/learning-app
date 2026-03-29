create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists daily_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  category text default 'General',
  target_date date not null default current_date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  subject text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  started_at timestamptz,
  ended_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists daily_goals_user_target_date_idx
  on daily_goals(user_id, target_date desc);

create index if not exists focus_sessions_user_completed_at_idx
  on focus_sessions(user_id, completed_at desc);

comment on table profiles is 'Study Buddy profile data.';
comment on table daily_goals is 'Daily learning goals per user.';
comment on table focus_sessions is 'Tracked focus sessions for study time.';

alter table profiles enable row level security;
alter table daily_goals enable row level security;
alter table focus_sessions enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "daily_goals_select_own" on daily_goals;
create policy "daily_goals_select_own"
  on daily_goals for select
  using (auth.uid() = user_id);

drop policy if exists "daily_goals_insert_own" on daily_goals;
create policy "daily_goals_insert_own"
  on daily_goals for insert
  with check (auth.uid() = user_id);

drop policy if exists "daily_goals_update_own" on daily_goals;
create policy "daily_goals_update_own"
  on daily_goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "daily_goals_delete_own" on daily_goals;
create policy "daily_goals_delete_own"
  on daily_goals for delete
  using (auth.uid() = user_id);

drop policy if exists "focus_sessions_select_own" on focus_sessions;
create policy "focus_sessions_select_own"
  on focus_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "focus_sessions_insert_own" on focus_sessions;
create policy "focus_sessions_insert_own"
  on focus_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "focus_sessions_update_own" on focus_sessions;
create policy "focus_sessions_update_own"
  on focus_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "focus_sessions_delete_own" on focus_sessions;
create policy "focus_sessions_delete_own"
  on focus_sessions for delete
  using (auth.uid() = user_id);
