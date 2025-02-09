import React from 'react';
import { Heart, MessageCircle, Bookmark, Repeat2, Plus } from 'lucide-react';

// Mock data for stories and posts
const stories = [
  { id: 1, username: 'sarah_designs', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 2, username: 'mike.photo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 3, username: 'travel_lisa', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 4, username: 'alex.adventures', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
];

const posts = [
  {
    id: 1,
    username: 'alex.adventures',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    likes: 1234,
    caption: 'Enjoying the sunset in Bali 🌅',
    comments: 48,
    time: '2 HOURS AGO'
  },
  {
    id: 2,
    username: 'sarah_designs',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200',
    likes: 892,
    caption: 'Neon lights and city vibes 🌆',
    comments: 32,
    time: '4 HOURS AGO'
  },
  {
    id: 3,
    username: 'travel_lisa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    location: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200',
    likes: 2156,
    caption: 'White and blue paradise 🇬🇷',
    comments: 76,
    time: '6 HOURS AGO'
  }
];

function Feed() {
  return (
    <div className="max-w-xl mx-auto">
      {/* Stories Section */}
      <div className="bg-white/60 backdrop-blur-lg p-4 mb-4 rounded-xl border border-green-100 shadow-sm overflow-x-auto">
        <div className="flex space-x-4">
          {/* Add to Story */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-16 h-16 rounded-full p-[2px] bg-white/50 border-2 border-green-200 hover:border-blue-400 transition-all duration-300 relative group">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-500 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
            <span className="text-xs text-gray-600">Add Story</span>
          </div>
          
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-green-400 via-blue-500 to-green-500 hover:scale-105 transition-transform duration-300">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <span className="text-xs text-gray-600">{story.username.slice(0, 8)}...</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white/60 backdrop-blur-lg rounded-xl border border-green-100 shadow-sm mb-4">
          <div className="flex items-center p-4">
            <img
              src={post.avatar}
              alt={post.username}
              className="w-8 h-8 rounded-full object-cover border border-green-200"
            />
            <div className="ml-3">
              <p className="font-semibold text-sm">{post.username}</p>
              <p className="text-xs text-gray-500">{post.location}</p>
            </div>
          </div>

          <img
            src={post.image}
            alt="post"
            className="w-full aspect-square object-cover"
          />

          <div className="p-4">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-4">
                <button className="p-2 rounded-full border border-green-200 hover:border-red-400 hover:bg-red-50 transition-all duration-300">
                  <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                </button>
                <button className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                  <MessageCircle className="w-5 h-5 text-gray-700 hover:text-blue-500" />
                </button>
                <button className="p-2 rounded-full border border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300">
                  <Repeat2 className="w-5 h-5 text-gray-700 hover:text-green-500" />
                </button>
              </div>
              <button className="p-2 rounded-full border border-green-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300">
                <Bookmark className="w-5 h-5 text-gray-700 hover:text-yellow-500" />
              </button>
            </div>
            <p className="font-semibold text-sm">{post.likes.toLocaleString()} likes</p>
            <p className="text-sm mt-1">
              <span className="font-semibold">{post.username}</span> {post.caption}
            </p>
            <p className="text-gray-500 text-xs mt-1">View all {post.comments} comments</p>
            <p className="text-gray-400 text-xs mt-1">{post.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;