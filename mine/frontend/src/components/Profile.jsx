import React from 'react';
import { ArrowLeft, Settings, Grid, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = ({ onBack }) => {
  const { user } = useAuth();
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  // Mock data
  const stats = {
    posts: 42,
    followers: 1234,
    following: 567
  };

  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800'
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <button>
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex items-center mb-6">
        <img
          src={user.profilePicture || defaultAvatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1 ml-6">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="font-semibold">{stats.posts}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{stats.followers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{stats.following}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <p className="font-medium">{user.name}</p>
        <p className="text-gray-600">{user.bio || 'No bio yet'}</p>
      </div>

      {/* Edit Profile Button */}
      <button className="w-full py-2 rounded-lg border border-gray-300 font-medium mb-6">
        Edit Profile
      </button>

      {/* Tabs */}
      <div className="flex border-t border-gray-200 mb-4">
        <button className="flex-1 py-3 border-t-2 border-black">
          <Grid className="w-6 h-6 mx-auto" />
        </button>
        <button className="flex-1 py-3">
          <Bookmark className="w-6 h-6 mx-auto text-gray-400" />
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map(post => (
          <div key={post.id} className="aspect-square">
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
