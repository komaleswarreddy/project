import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import Stories from '../components/Stories';
import Post from '../components/Post';
import { PlusIcon, HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';
import AddPost from '../components/AddPost';
import Search from '../components/Search';
import Profile from '../components/Profile';
import toast from 'react-hot-toast';

export default function Home() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/feed');
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const fetchStories = async () => {
    try {
      const response = await api.get('/stories');
      setStories(response.data.data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <nav className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-semibold text-emerald-600">IIITverse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddPost(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Add Post
              </button>
              <button 
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stories stories={stories} currentUser={user} onStoriesUpdate={fetchStories} />
        
        <div className="mt-8 space-y-8">
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              currentUser={user}
              onPostUpdate={fetchPosts}
            />
          ))}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button className="text-black hover:text-gray-600">
              <HomeIconSolid className="h-7 w-7" />
            </button>
            <button 
              onClick={() => setShowSearch(true)}
              className="text-black hover:text-gray-600"
            >
              <MagnifyingGlassIcon className="h-7 w-7" />
            </button>
            <button 
              onClick={() => setShowAddPost(true)}
              className="text-black hover:text-gray-600"
            >
              <PlusCircleIcon className="h-7 w-7" />
            </button>
            <button 
              onClick={() => setShowProfile(true)}
              className="text-black hover:text-gray-600"
            >
              <img 
                src={`http://localhost:5000${user.profilePicture}`}
                alt={user.username}
                className="h-7 w-7 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showAddPost && (
        <AddPost
          isOpen={showAddPost}
          onClose={() => setShowAddPost(false)}
          onPostCreated={fetchPosts}
        />
      )}

      {showSearch && (
        <Search onClose={() => setShowSearch(false)} />
      )}

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
