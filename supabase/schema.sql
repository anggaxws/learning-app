create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
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

-- Optional sample profile:
-- insert into profiles (full_name) values ('Angga') returning id;
