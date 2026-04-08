-- =============================================
-- MetroLove Database Schema
-- =============================================

-- 1. Profiles (사용자 프로필)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text not null,
  bio text,
  avatar_url text,
  gender text check (gender in ('male', 'female', 'other')),
  age integer check (age >= 18 and age <= 100),
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. WiFi Sessions (WiFi 접속 기록)
create table public.wifi_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  ssid text not null,
  line smallint check (line >= 1 and line <= 9),
  station text,
  connected_at timestamptz default now() not null,
  disconnected_at timestamptz
);

alter table public.wifi_sessions enable row level security;

create policy "Users can view active sessions on same line"
  on public.wifi_sessions for select using (true);

create policy "Users can manage their own sessions"
  on public.wifi_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.wifi_sessions for update using (auth.uid() = user_id);

-- 3. Swipes (스와이프 기록)
create table public.swipes (
  id uuid default gen_random_uuid() primary key,
  swiper_id uuid references public.profiles on delete cascade not null,
  swiped_id uuid references public.profiles on delete cascade not null,
  direction text not null check (direction in ('like', 'pass')),
  created_at timestamptz default now() not null,
  unique (swiper_id, swiped_id)
);

alter table public.swipes enable row level security;

create policy "Users can view their own swipes"
  on public.swipes for select using (auth.uid() = swiper_id);

create policy "Users can create swipes"
  on public.swipes for insert with check (auth.uid() = swiper_id);

-- 4. Matches (매칭)
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  user_a uuid references public.profiles on delete cascade not null,
  user_b uuid references public.profiles on delete cascade not null,
  status text not null default 'matched' check (status in ('matched', 'extended', 'expired')),
  created_at timestamptz default now() not null,
  expires_at timestamptz default (now() + interval '30 minutes') not null,
  extended_by uuid[] default '{}'
);

alter table public.matches enable row level security;

create policy "Users can view their own matches"
  on public.matches for select using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can update their own matches"
  on public.matches for update using (auth.uid() = user_a or auth.uid() = user_b);

-- 5. Messages (채팅 메시지)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches on delete cascade not null,
  sender_id uuid references public.profiles on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null,
  read_at timestamptz
);

alter table public.messages enable row level security;

create policy "Match participants can view messages"
  on public.messages for select using (
    exists (
      select 1 from public.matches
      where matches.id = messages.match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
    )
  );

create policy "Match participants can send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches
      where matches.id = match_id
      and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
      and matches.status in ('matched', 'extended')
    )
  );

-- =============================================
-- Functions
-- =============================================

-- Auto-create match when mutual like happens
create or replace function public.check_mutual_match()
returns trigger as $$
begin
  if NEW.direction = 'like' then
    -- Check if the other person already liked me
    if exists (
      select 1 from public.swipes
      where swiper_id = NEW.swiped_id
      and swiped_id = NEW.swiper_id
      and direction = 'like'
    ) then
      -- Create match
      insert into public.matches (user_a, user_b)
      values (
        least(NEW.swiper_id, NEW.swiped_id),
        greatest(NEW.swiper_id, NEW.swiped_id)
      );
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_swipe_check_match
  after insert on public.swipes
  for each row execute function public.check_mutual_match();

-- Enable realtime for active tables
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.wifi_sessions;
