-- Create users table for chat participants
create table if not exists users (
  id uuid primary key default auth.uid(),
  username text unique not null,
  avatar_url text,
  last_seen timestamptz,
  created_at timestamptz default now()
);

-- Create chat rooms table
create table if not exists chat_rooms (
  id text primary key,
  participant1_id uuid references users(id) not null,
  participant2_id uuid references users(id) not null,
  last_message text,
  last_message_time timestamptz,
  created_at timestamptz default now()
);

-- Create messages table
create table if not exists messages (
  id bigint primary key generated always as identity,
  chat_room_id text references chat_rooms(id) not null,
  sender_id uuid references users(id) not null,
  receiver_id uuid references users(id) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Create indexes for better query performance
create index if not exists idx_chat_rooms_participants on chat_rooms(participant1_id, participant2_id);
create index if not exists idx_messages_chat_room on messages(chat_room_id);
create index if not exists idx_messages_created_at on messages(created_at);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table chat_rooms enable row level security;
alter table messages enable row level security;

-- Create policies for users table
create policy "Users can read all users"
  on users for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on users for update
  to authenticated
  using (id = auth.uid());

-- Create policies for chat rooms
create policy "Users can read their chat rooms"
  on chat_rooms for select
  to authenticated
  using (
    participant1_id = auth.uid() or 
    participant2_id = auth.uid()
  );

create policy "Users can create chat rooms with other users"
  on chat_rooms for insert
  to authenticated
  with check (
    participant1_id = auth.uid() or 
    participant2_id = auth.uid()
  );

create policy "Users can update their chat rooms"
  on chat_rooms for update
  to authenticated
  using (
    participant1_id = auth.uid() or 
    participant2_id = auth.uid()
  );

-- Create policies for messages
create policy "Users can read messages in their chat rooms"
  on messages for select
  to authenticated
  using (
    exists (
      select 1 from chat_rooms
      where id = messages.chat_room_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

create policy "Users can send messages"
  on messages for insert
  to authenticated
  with check (
    sender_id = auth.uid() and
    exists (
      select 1 from chat_rooms
      where id = messages.chat_room_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

-- Function to update user's last_seen
create or replace function update_user_last_seen()
returns trigger as $$
begin
  update users
  set last_seen = now()
  where id = auth.uid();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update last_seen on message send
create trigger on_message_sent
  after insert on messages
  for each row
  execute function update_user_last_seen();
