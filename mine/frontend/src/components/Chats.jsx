import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

const Chats = ({ onBack }) => {
  const [message, setMessage] = useState('');

  // Mock data for messages
  const messages = [
    {
      id: 1,
      sender: 'john.doe',
      content: 'Hey, how are you?',
      timestamp: '10:30 AM',
      isMine: false
    },
    {
      id: 2,
      sender: 'me',
      content: 'I\'m good! How about you?',
      timestamp: '10:31 AM',
      isMine: true
    },
    {
      id: 3,
      sender: 'john.doe',
      content: 'Great! Just working on some new designs.',
      timestamp: '10:32 AM',
      isMine: false
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Implement message sending
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 p-4 border-b">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
            alt="John Doe"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 font-medium">john.doe</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.isMine
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.isMine ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className={`p-2 rounded-full ${
              message.trim()
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
