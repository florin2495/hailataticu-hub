create table if not exists public.hub_feedback (
  id uuid primary key default gen_random_uuid(),
  game text not null check (char_length(game) between 1 and 30),
  message text not null check (char_length(message) between 1 and 1000),
  nickname text check (nickname is null or char_length(nickname) <= 40),
  app_version text check (app_version is null or char_length(app_version) <= 20),
  created_at timestamptz not null default now()
);
create index if not exists hub_feedback_created_at_idx on public.hub_feedback (created_at desc);
alter table public.hub_feedback enable row level security;
-- no policies: only the server (service role key) reads/writes.
