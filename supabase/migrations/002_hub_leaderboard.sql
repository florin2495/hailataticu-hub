-- Shared leaderboard, owned by the hub. Every game upserts here through the service role key.
create table if not exists public.hub_leaderboard (
  game text not null check (char_length(game) between 1 and 30),
  player_key text not null check (char_length(player_key) between 1 and 40),
  display_name text not null check (char_length(display_name) between 1 and 40),
  wins integer not null default 0 check (wins >= 0),
  games integer not null default 0 check (games >= 0),
  updated_at timestamptz not null default now(),
  primary key (game, player_key)
);
create index if not exists hub_leaderboard_game_rank_idx on public.hub_leaderboard (game, wins desc, games desc);
alter table public.hub_leaderboard enable row level security;

-- One row per finished round, so a round is never counted twice.
create table if not exists public.hub_leaderboard_rounds (
  game text not null check (char_length(game) between 1 and 30),
  room_code text not null check (char_length(room_code) between 1 and 40),
  round_no integer not null,
  created_at timestamptz not null default now(),
  primary key (game, room_code, round_no)
);
alter table public.hub_leaderboard_rounds enable row level security;
-- no policies: only the server (service role key) reads/writes.
