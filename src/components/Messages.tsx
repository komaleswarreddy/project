import { useState } from 'react';
import { Search, MessageCircle, ArrowLeft } from 'lucide-react';
import Chats from './Chats';

interface MessagesProps {
  onBack: () => void;
}

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

// Mock current user
const MOCK_USER: ChatUser = {
  id: 'mock-user-1',
  username: 'TestUser1',
  avatar_url: 'https://ui-avatars.com/api/?name=TestUser1',
  last_seen: new Date().toISOString()
};

// Mock chat rooms with test data
const TEST_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'chat_1',
    participant1_id: 'mock-user-1',
    participant2_id: 'mock-user-2',
    last_message: 'See you tomorrow!',
    last_message_time: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
    participant1: MOCK_USER,
    participant2: {
      id: 'mock-user-2',
      username: 'TestUser2',
      avatar_url: 'https://ui-avatars.com/api/?name=TestUser2',
      last_seen: new Date(Date.now() - 5 * 60000).toISOString()
    }
  },
  {
    id: 'chat_2',
    participant1_id: 'mock-user-1',
    participant2_id: 'mock-user-3',
    last_message: 'That sounds great!',
    last_message_time: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    participant1: MOCK_USER,
    participant2: {
      id: 'mock-user-3',
      username: 'Alice',
      avatar_url: 'https://ui-avatars.com/api/?name=Alice',
      last_seen: new Date(Date.now() - 15 * 60000).toISOString()
    }
  },
  {
    id: 'chat_3',
    participant1_id: 'mock-user-1',
    participant2_id: 'mock-user-4',
    last_message: 'Thanks for your help!',
    last_message_time: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    participant1: MOCK_USER,
    participant2: {
      id: 'mock-user-4',
      username: 'Bob',
      avatar_url: 'https://ui-avatars.com/api/?name=Bob',
      last_seen: new Date(Date.now() - 30 * 60000).toISOString()
    }
  }
];

function Messages({ onBack }: MessagesProps) {
  const [chatRooms] = useState<ChatRoom[]>(TEST_CHAT_ROOMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  const getOtherParticipant = (room: ChatRoom) => {
    return room.participant1_id === MOCK_USER.id ? room.participant2 : room.participant1;
  };

  const formatLastMessageTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (selectedRoom) {
    return <Chats onBack={() => setSelectedRoom(null)} chatRoom={selectedRoom} />;
  }

  return (
    <div className="max-w-xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-white/60 backdrop-blur-lg rounded-xl border border-green-100 shadow-sm p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-4 py-2 pl-10 rounded-full border border-green-100 focus:outline-none focus:border-blue-400 bg-white/50"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Chat Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
              <MessageCircle className="w-12 h-12" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation with someone!</p>
            </div>
          ) : (
            chatRooms
              .filter(room => {
                const otherParticipant = getOtherParticipant(room);
                return otherParticipant.username.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map(room => {
                const otherParticipant = getOtherParticipant(room);
                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className="w-full p-3 flex items-center space-x-3 hover:bg-white/50 rounded-xl transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={otherParticipant.avatar_url || `https://ui-avatars.com/api/?name=${otherParticipant.username}`}
                        alt={otherParticipant.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {otherParticipant.last_seen && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{otherParticipant.username}</h3>
                        {room.last_message_time && (
                          <span className="text-xs text-gray-500 ml-2">
                            {formatLastMessageTime(room.last_message_time)}
                          </span>
                        )}
                      </div>
                      {room.last_message && (
                        <p className="text-sm text-gray-500 truncate">{room.last_message}</p>
                      )}
                    </div>
                  </button>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;