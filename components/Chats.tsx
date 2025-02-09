import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface ChatUser {
  id: string;
  username: string;
  avatar_url?: string;
  last_seen?: string;
}

interface ChatRoom {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_time?: string;
  participant1: ChatUser;
  participant2: ChatUser;
}

interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatsProps {
  onBack: () => void;
  chatRoom: ChatRoom;
}

// Mock current user
const MOCK_USER: ChatUser = {
  id: 'mock-user-1',
  username: 'TestUser1',
  avatar_url: 'https://ui-avatars.com/api/?name=TestUser1',
  last_seen: new Date().toISOString()
};

// Mock messages for each chat room
const TEST_MESSAGES: Record<string, Message[]> = {
  'chat_1': [
    {
      id: '1',
      chat_room_id: 'chat_1',
      sender_id: 'mock-user-1',
      receiver_id: 'mock-user-2',
      content: 'Hey, how are you?',
      created_at: new Date(Date.now() - 24 * 60 * 60000).toISOString()
    },
    {
      id: '2',
      chat_room_id: 'chat_1',
      sender_id: 'mock-user-2',
      receiver_id: 'mock-user-1',
      content: 'Hi! I\'m good, thanks! How about you?',
      created_at: new Date(Date.now() - 23 * 60 * 60000).toISOString()
    },
    ...[...Array(20)].map((_, i) => ({
      id: `extra_${i + 1}`,
      chat_room_id: 'chat_1',
      sender_id: i % 2 === 0 ? 'mock-user-1' : 'mock-user-2',
      receiver_id: i % 2 === 0 ? 'mock-user-2' : 'mock-user-1',
      content: `This is test message ${i + 1}. Adding some more content to make it longer and test the layout properly. Let's see how it handles multiple lines of text in a single message.`,
      created_at: new Date(Date.now() - (22 - i) * 60 * 60000).toISOString()
    }))
  ],
  'chat_2': [
    {
      id: '5',
      chat_room_id: 'chat_2',
      sender_id: 'mock-user-3',
      receiver_id: 'mock-user-1',
      content: 'Hi! I saw your post about the hackathon',
      created_at: new Date(Date.now() - 5 * 60 * 60000).toISOString()
    },
    {
      id: '6',
      chat_room_id: 'chat_2',
      sender_id: 'mock-user-1',
      receiver_id: 'mock-user-3',
      content: 'Hey Alice! Yes, are you interested in joining our team?',
      created_at: new Date(Date.now() - 4 * 60 * 60000).toISOString()
    }
  ],
  'chat_3': [
    {
      id: '7',
      chat_room_id: 'chat_3',
      sender_id: 'mock-user-1',
      receiver_id: 'mock-user-4',
      content: 'Hey Bob, could you review my PR?',
      created_at: new Date(Date.now() - 6 * 60 * 60000).toISOString()
    },
    {
      id: '8',
      chat_room_id: 'chat_3',
      sender_id: 'mock-user-4',
      receiver_id: 'mock-user-1',
      content: 'Sure! I\'ll take a look right now',
      created_at: new Date(Date.now() - 5.5 * 60 * 60000).toISOString()
    }
  ]
};

function Chats({ onBack, chatRoom }: ChatsProps) {
  const [messages, setMessages] = useState<Message[]>(TEST_MESSAGES[chatRoom.id] || []);
  const [newMessage, setNewMessage] = useState('');

  const otherParticipant = chatRoom.participant1_id === MOCK_USER.id ? chatRoom.participant2 : chatRoom.participant1;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: String(Date.now()),
      chat_room_id: chatRoom.id,
      sender_id: MOCK_USER.id,
      receiver_id: otherParticipant.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={otherParticipant.avatar_url || `https://ui-avatars.com/api/?name=${otherParticipant.username}`}
            alt={otherParticipant.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium">{otherParticipant.username}</h3>
            <p className="text-sm text-gray-500">
              {otherParticipant.last_seen ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        {/* Scrollable Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-20">
          {messages.map(message => {
            const isOwnMessage = message.sender_id === MOCK_USER.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-lg fixed bottom-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chats;