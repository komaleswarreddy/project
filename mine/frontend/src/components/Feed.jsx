import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Bookmark, Repeat2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Feed = ({ getstory }) => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      setPosts(response.data.filter(post => !post.isStory));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      const storiesData = response.data
        .filter(post => post.isStory)
        .map(story => ({
          id: story._id,
          username: story.username,
          avatar: story.profile || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          profile: story.profile || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          storyImages: `http://localhost:5000/images/${story.fileUrl.split('/').pop()}`,
          storyCaptions: [story.caption]
        }));
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post('http://localhost:5000/likes', {
        reelId: postId,
        username: user.name,
        action: likedPosts.has(postId) ? 'unlike' : 'like'
      });

      setLikedPosts(prev => {
        const newLiked = new Set(prev);
        if (newLiked.has(postId)) {
          newLiked.delete(postId);
        } else {
          newLiked.add(postId);
        }
        return newLiked;
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Stories */}
      <div className="flex overflow-x-auto space-x-4 p-4 -mx-4 mb-6 scrollbar-hide">
        {stories.map(story => (
          <button
            key={story.id}
            className="flex-none"
            onClick={() => getstory(story)}
          >
            <div className="w-16 h-16 rounded-full ring-2 ring-purple-500 p-1">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <p className="text-xs text-center mt-1 text-gray-600">{story.username.split('.')[0]}</p>
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center p-4">
              <img
                src={post.profile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={post.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-800">{post.username}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Image */}
            <img
              src={`http://localhost:5000/images/${post.fileUrl.split('/').pop()}`}
              alt="Post content"
              className="w-full aspect-square object-cover"
            />

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`${likedPosts.has(post._id) ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    <Heart className="w-6 h-6" fill={likedPosts.has(post._id) ? "currentColor" : "none"} />
                  </button>
                  <button className="text-gray-600">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="text-gray-600">
                    <Repeat2 className="w-6 h-6" />
                  </button>
                </div>
                <button
                  onClick={() => handleSave(post._id)}
                  className={`${savedPosts.has(post._id) ? 'text-blue-500' : 'text-gray-600'}`}
                >
                  <Bookmark className="w-6 h-6" fill={savedPosts.has(post._id) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Caption */}
              <p className="text-gray-800 mt-2">
                <span className="font-medium">{post.username}</span>{' '}
                {post.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
