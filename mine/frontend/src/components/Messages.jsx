import React, { useState } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';

const Messages = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for chats
  const chats = [
    {
      id: 1,
      username: 'john.doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      lastMessage: 'Hey, how are you?',
      timestamp: '2m ago',
      unread: true
    },
    {
      id: 2,
      username: 'jane.smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      lastMessage: 'The project looks great!',
      timestamp: '1h ago',
      unread: false
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Chat List */}
      <div className="space-y-4">
        {chats.map(chat => (
          <div
            key={chat.id}
            className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <img
              src={chat.avatar}
              alt={chat.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-900">{chat.username}</p>
                <p className="text-xs text-gray-500">{chat.timestamp}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-sm ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
