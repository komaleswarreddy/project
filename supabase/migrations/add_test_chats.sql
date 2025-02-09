-- Insert test users
INSERT INTO users (id, username, avatar_url)
VALUES 
  ('mock-user-1', 'TestUser1', 'https://ui-avatars.com/api/?name=TestUser1'),
  ('mock-user-2', 'TestUser2', 'https://ui-avatars.com/api/?name=TestUser2'),
  ('mock-user-3', 'Alice', 'https://ui-avatars.com/api/?name=Alice'),
  ('mock-user-4', 'Bob', 'https://ui-avatars.com/api/?name=Bob')
ON CONFLICT (id) DO UPDATE 
SET username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url;

-- Create chat rooms
INSERT INTO chat_rooms (id, participant1_id, participant2_id, last_message, last_message_time)
VALUES
  ('chat_1', 'mock-user-1', 'mock-user-2', 'See you tomorrow!', NOW()),
  ('chat_2', 'mock-user-1', 'mock-user-3', 'That sounds great!', NOW() - interval '1 hour'),
  ('chat_3', 'mock-user-1', 'mock-user-4', 'Thanks for your help!', NOW() - interval '2 hours')
ON CONFLICT (id) DO UPDATE 
SET last_message = EXCLUDED.last_message,
    last_message_time = EXCLUDED.last_message_time;

-- Add messages to chat 1 (TestUser1 and TestUser2)
INSERT INTO messages (chat_room_id, sender_id, receiver_id, content, created_at)
VALUES
  ('chat_1', 'mock-user-1', 'mock-user-2', 'Hey, how are you?', NOW() - interval '1 day'),
  ('chat_1', 'mock-user-2', 'mock-user-1', 'Hi! I''m good, thanks! How about you?', NOW() - interval '23 hours'),
  ('chat_1', 'mock-user-1', 'mock-user-2', 'I''m doing great! Working on this new project.', NOW() - interval '22 hours'),
  ('chat_1', 'mock-user-2', 'mock-user-1', 'That''s awesome! What kind of project is it?', NOW() - interval '21 hours'),
  ('chat_1', 'mock-user-1', 'mock-user-2', 'It''s a social media platform for developers!', NOW() - interval '20 hours'),
  ('chat_1', 'mock-user-2', 'mock-user-1', 'Sounds interesting! Want to meet up tomorrow to discuss?', NOW() - interval '1 hour'),
  ('chat_1', 'mock-user-1', 'mock-user-2', 'Sure! Coffee at 10?', NOW() - interval '30 minutes'),
  ('chat_1', 'mock-user-2', 'mock-user-1', 'Perfect!', NOW() - interval '25 minutes'),
  ('chat_1', 'mock-user-1', 'mock-user-2', 'See you tomorrow!', NOW() - interval '20 minutes');

-- Add messages to chat 2 (TestUser1 and Alice)
INSERT INTO messages (chat_room_id, sender_id, receiver_id, content, created_at)
VALUES
  ('chat_2', 'mock-user-3', 'mock-user-1', 'Hi! I saw your post about the hackathon', NOW() - interval '5 hours'),
  ('chat_2', 'mock-user-1', 'mock-user-3', 'Hey Alice! Yes, are you interested in joining our team?', NOW() - interval '4 hours'),
  ('chat_2', 'mock-user-3', 'mock-user-1', 'Definitely! I have experience with React and Node.js', NOW() - interval '3 hours'),
  ('chat_2', 'mock-user-1', 'mock-user-3', 'Perfect! That''s exactly what we need', NOW() - interval '2 hours'),
  ('chat_2', 'mock-user-3', 'mock-user-1', 'When is the next team meeting?', NOW() - interval '1.5 hours'),
  ('chat_2', 'mock-user-1', 'mock-user-3', 'This Friday at 3 PM', NOW() - interval '1.2 hours'),
  ('chat_2', 'mock-user-3', 'mock-user-1', 'That sounds great!', NOW() - interval '1 hour');

-- Add messages to chat 3 (TestUser1 and Bob)
INSERT INTO messages (chat_room_id, sender_id, receiver_id, content, created_at)
VALUES
  ('chat_3', 'mock-user-1', 'mock-user-4', 'Hey Bob, could you review my PR?', NOW() - interval '6 hours'),
  ('chat_3', 'mock-user-4', 'mock-user-1', 'Sure! I''ll take a look right now', NOW() - interval '5.5 hours'),
  ('chat_3', 'mock-user-4', 'mock-user-1', 'Just finished reviewing. Left some comments', NOW() - interval '4 hours'),
  ('chat_3', 'mock-user-1', 'mock-user-4', 'Thanks! I''ll address them right away', NOW() - interval '3.5 hours'),
  ('chat_3', 'mock-user-4', 'mock-user-1', 'No problem! Let me know if you need any clarification', NOW() - interval '3 hours'),
  ('chat_3', 'mock-user-1', 'mock-user-4', 'Will do! Really appreciate your detailed feedback', NOW() - interval '2.5 hours'),
  ('chat_3', 'mock-user-4', 'mock-user-1', 'Happy to help!', NOW() - interval '2.2 hours'),
  ('chat_3', 'mock-user-1', 'mock-user-4', 'Thanks for your help!', NOW() - interval '2 hours');
