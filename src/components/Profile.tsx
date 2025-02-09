import React, { FC } from 'react';
import { ArrowLeft, Plus, Grid, MoreHorizontal } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
}

const userProfile = {
  username: 'e.johnson',
  fullName: 'Elliott Johnson',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  bio: 'Freelance Artist/Generalist TD. Available Now',
  location: 'United Kingdom',
  stats: {
    posts: 21,
    followers: 563,
    following: 172
  },
  socialLinks: [
    { name: 'Behance', icon: 'https://cdn.worldvectorlogo.com/logos/behance-1.svg', color: 'bg-[#1769ff]' },
    { name: 'Dribbble', icon: 'https://cdn.worldvectorlogo.com/logos/dribbble-icon-1.svg', color: 'bg-[#ea4c89]' },
    { name: 'Pinterest', icon: 'https://cdn.worldvectorlogo.com/logos/pinterest-1.svg', color: 'bg-[#e60023]' }
  ],
  posts: [
    { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' },
    { id: 2, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' },
    { id: 3, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' }
  ]
};

const Profile: FC<ProfileProps> = ({ onBack }) => {
  return (
    <div className="max-w-xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-green-100 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-xl font-semibold">{userProfile.username}</h2>
          <button className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
            <MoreHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-200">
            <img
              src={userProfile.avatar}
              alt={userProfile.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <div className="text-center">
                <div className="font-bold">{userProfile.stats.posts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{userProfile.stats.followers}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{userProfile.stats.following}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold">{userProfile.fullName}</h3>
          <p className="text-gray-600 text-sm">{userProfile.bio}</p>
          <p className="text-gray-500 text-sm">{userProfile.location}</p>
        </div>

        <div className="flex space-x-2 mb-6">
          <button className="flex-1 px-4 py-2 bg-white/50 rounded-lg border border-green-200 font-medium text-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
            Edit Profile
          </button>
          <button className="flex-1 px-4 py-2 bg-white/50 rounded-lg border border-green-200 font-medium text-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
            Promotions
          </button>
          <button className="flex-1 px-4 py-2 bg-white/50 rounded-lg border border-green-200 font-medium text-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
            Insights
          </button>
        </div>

        <div className="flex space-x-4">
          <button className="w-12 h-12 rounded-full bg-white/50 border border-green-200 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
          {userProfile.socialLinks.map((link, index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center hover:opacity-90 transition-opacity duration-300`}
            >
              <img src={link.icon} alt={link.name} className="w-6 h-6 invert" />
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-green-100 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
          {userProfile.posts.map((post) => (
            <div key={post.id} className="aspect-square">
              <img
                src={post.image}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;