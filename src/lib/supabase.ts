import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatUser {
  id: string;
  username: string;
  avatar_url?: string;
  last_seen?: string;
}

export interface ChatRoom {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_time?: string;
  created_at: string;
  participant1?: ChatUser;
  participant2?: ChatUser;
}

export interface Message {
  id: number;
  chat_room_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  created_at: string;
}

export async function getUserChatRooms(userId: string) {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      participant1:participant1_id(id, username, avatar_url, last_seen),
      participant2:participant2_id(id, username, avatar_url, last_seen)
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_time', { ascending: false });

  if (error) throw error;
  return data as (ChatRoom & { participant1: ChatUser; participant2: ChatUser })[];
}

export async function getOrCreateChatRoom(userId1: string, userId2: string) {
  // First, try to find an existing chat room
  const { data: existingRoom } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      participant1:participant1_id(id, username, avatar_url, last_seen),
      participant2:participant2_id(id, username, avatar_url, last_seen)
    `)
    .or(`and(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),and(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`)
    .single();

  if (existingRoom) {
    return existingRoom as ChatRoom & { participant1: ChatUser; participant2: ChatUser };
  }

  // If no room exists, create a new one
  const roomId = `${userId1}_${userId2}`;
  const { data: newRoom, error } = await supabase
    .from('chat_rooms')
    .insert([
      {
        id: roomId,
        participant1_id: userId1,
        participant2_id: userId2,
      },
    ])
    .select(`
      *,
      participant1:participant1_id(id, username, avatar_url, last_seen),
      participant2:participant2_id(id, username, avatar_url, last_seen)
    `)
    .single();

  if (error) throw error;
  return newRoom as ChatRoom & { participant1: ChatUser; participant2: ChatUser };
}
