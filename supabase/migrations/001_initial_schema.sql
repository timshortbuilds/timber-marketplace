-- Combined Migration: 001_initial_schema.sql
-- Includes: Profiles, Listings, Bookings, Messages, Audit Logs

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Public user data linked to Auth)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  role text check (role in ('hunter', 'landowner', 'admin')),
  is_member boolean default false
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger: Automatically create a public profile when a new User signs up via Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow idempotency in dev
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. LISTINGS TABLE
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  location text not null,
  price_per_day integer not null,
  description text,
  game_types text[] default '{}',
  sporting_arms text[] default '{}',
  acreage integer,
  features text[] default '{}',
  accommodations text[] default '{}',
  images text[] default '{}',
  is_verified boolean default false,
  coordinates jsonb,
  landowner_id uuid references auth.users(id) not null
);

-- 3. BOOKINGS TABLE
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  listing_id uuid references public.listings(id) not null,
  hunter_id uuid references auth.users(id) not null,
  start_date date not null,
  end_date date not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price integer
);

-- 4. MESSAGES TABLE
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  listing_id uuid references public.listings(id),
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false
);

-- 5. AUDIT LOGS TABLE
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id),
  action text not null,
  details jsonb
);

-- 6. ROW LEVEL SECURITY (RLS)

-- Listings Policies
alter table public.listings enable row level security;

create policy "Listings are viewable by everyone"
  on public.listings for select
  using ( true );

create policy "Landowners and Admins can insert listings"
  on public.listings for insert
  with check ( 
    auth.uid() = landowner_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

create policy "Landowners and Admins can update listings"
  on public.listings for update
  using ( 
    auth.uid() = landowner_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

create policy "Landowners and Admins can delete listings"
  on public.listings for delete
  using ( 
    auth.uid() = landowner_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- Bookings Policies
alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
  on public.bookings for select
  using ( 
    auth.uid() = hunter_id OR 
    auth.uid() in (select landowner_id from public.listings where id = listing_id) OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

create policy "Hunters can create bookings"
  on public.bookings for insert
  with check ( auth.uid() = hunter_id );

-- Messages Policies
alter table public.messages enable row level security;

create policy "Users can view their own messages"
  on public.messages for select
  using ( auth.uid() = sender_id OR auth.uid() = receiver_id );

create policy "Users can insert messages"
  on public.messages for insert
  with check ( auth.uid() = sender_id );

-- Audit Logs Policies
alter table public.audit_logs enable row level security;

create policy "Admins can view audit logs"
  on public.audit_logs for select
  using ( 
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  );

-- 7. INDEXES & TRIGGERS
create index listings_location_idx on public.listings using gin(to_tsvector('english', location));
create index listings_game_types_idx on public.listings using gin(game_types);
create index messages_participants_idx on public.messages(sender_id, receiver_id);

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_listings_updated_at
    before update on public.listings
    for each row
    execute procedure update_updated_at_column();

create trigger update_bookings_updated_at
    before update on public.bookings
    for each row
    execute procedure update_updated_at_column();