import React, { FC, useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
}

interface UserProfile {
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

const Profile: FC<ProfileProps> = ({ onBack }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '',
    fullName: '',
    avatar: '',
    bio: '',
    location: '',
    stats: {
      posts: 10,
      followers: 20,
      following: 30,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState([]);
  const [newAvatar, setNewAvatar] = useState<File | null>(null); // For the new avatar image

  useEffect(() => {
    // Fetch user profile from backend
    fetch('http://localhost:5000/userProfile')
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
        setFormData(data);
      })
      .catch((err) => console.error(err));

    // Fetch posts from backend
    fetch('http://localhost:5000/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAvatar(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!formData) return;

    const updatedProfile = { ...formData };

    // If a new avatar is selected, append it to the form data
    if (newAvatar) {
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', newAvatar);
      formDataToSend.append('fullName', updatedProfile.fullName || '');
      formDataToSend.append('bio', updatedProfile.bio || '');
      formDataToSend.append('location', updatedProfile.location || '');

      // Make a request to update the profile with the new avatar
      fetch('http://localhost:5000/userProfile', {
        method: 'PUT',
        body: formDataToSend,
      })
        .then((res) => res.json())
        .then((updatedProfile) => {
          setUserProfile(updatedProfile);
          setIsEditing(false);
        })
        .catch((err) => console.error(err));
    } else {
      // If no new avatar, update profile without the image
      fetch('http://localhost:5000/userProfile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      })
        .then((res) => res.json())
        .then((updatedProfile) => {
          setUserProfile(updatedProfile);
          setIsEditing(false);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-xl font-bold">{userProfile.username}</h2>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden">
            <img src={userProfile.avatar} alt={userProfile.username} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex justify-around text-center">
              <div>
                <div className="font-bold text-lg">{userProfile.stats.posts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div>
                <div className="font-bold text-lg">{userProfile.stats.followers}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div>
                <div className="font-bold text-lg">{userProfile.stats.following}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {!isEditing ? (
          <div>
            <h3 className="text-lg font-semibold">{userProfile.fullName}</h3>
            <p className="text-gray-600">{userProfile.bio}</p>
            <p className="text-gray-500 text-sm">{userProfile.location}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              name="fullName"
              value={formData?.fullName || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Full Name"
            />
            <textarea
              name="bio"
              value={formData?.bio || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Bio"
            />
            <input
              type="text"
              name="location"
              value={formData?.location || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Location"
            />
            <input
              type="file"
              onChange={handleAvatarChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        {/* Edit Button */}
        <div className="mt-4 flex space-x-2">
          {!isEditing ? (
            <button onClick={handleEditClick} className="w-full bg-blue-500 text-white py-2 rounded-md">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="w-full bg-green-500 text-white py-2 rounded-md">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="w-full bg-gray-500 text-white py-2 rounded-md">
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Posts Grid */}
       
        <div className="mt-6">
  <h4 className="font-semibold mb-2">Posts</h4>
  <div className="grid grid-cols-3 gap-4">
    {posts.map((post, index) => {
      const isVideo = post.fileUrl?.match(/\.(mp4|mov|avi|webm)$/i);
      
      return (
        <div key={index} className="w-full aspect-square overflow-hidden rounded-lg">
          {isVideo ? (
            <video 
              src={post.fileUrl} 
              controls 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={post.fileUrl} 
              alt="" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      );
    })}
  </div>
</div>



      </div>
    </div>
  );
};
export default Profile

