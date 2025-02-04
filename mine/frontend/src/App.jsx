import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';
import Send from './icons/Send';
import Home from './icons/Home';
import SearchIcon from './icons/SearchIcon';
import User from './icons/User';
import Feed from './components/Feed';
import Search from './components/Search';
import Reels from './components/Reels';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Addpost from './components/Addpost';
import CreatePost from './components/CreatePost';
import Displaystory from './components/Displaystory';
import Chats from './components/Chats';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Home Component
const HomePage = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('feed');
  const [selectedStory, setSelectedStory] = useState(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: ['IIITverse'],
      typeSpeed: 150,
      backSpeed: 70,
      backDelay: 5000,
      loop: true,
      showCursor: false,
    };
    
    const typed = new Typed(titleRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-lg border-b border-green-100 z-50">
        <div className="max-w-xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 
            ref={titleRef}
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent font-['Playfair_Display']"
          />
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <button 
              className="px-4 py-2 rounded-full border border-green-200 bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              onClick={() => setCurrentPage('addPost')}
            >
              Add Post
            </button>
            <button 
              className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
              onClick={() => setCurrentPage('messages')}
            >
              <Send className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full border border-red-200 bg-red-500 text-white text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-16">
        {currentPage === 'feed' && <Feed getstory={(story) => { 
          setSelectedStory(story); 
          setCurrentPage('displaystory'); 
        }} />}
        {currentPage === 'search' && <Search onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'reels' && <Reels onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'messages' && <Messages onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'profile' && <Profile onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'addPost' && <Addpost onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'createPost' && <CreatePost onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'displaystory' && <Displaystory story={selectedStory} onBack={() => setCurrentPage('feed')} />}
        {currentPage === 'chats' && <Chats onBack={() => setCurrentPage('feed')} />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-lg border-t border-green-100">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage('feed')}
              className="p-2 rounded-full hover:bg-green-50 transition-all duration-300"
            >
              <Home className={`w-6 h-6 ${currentPage === 'feed' ? 'text-blue-700' : 'text-gray-500'}`} />
            </button>
            <button
              onClick={() => setCurrentPage('search')}
              className="p-2 rounded-full hover:bg-green-50 transition-all duration-300"
            >
              <SearchIcon className={`w-6 h-6 ${currentPage === 'search' ? 'text-blue-700' : 'text-gray-500'}`} />
            </button>
            <button
              onClick={() => setCurrentPage('reels')}
              className="p-2 rounded-full hover:bg-green-50 transition-all duration-300"
            >
              <svg 
                viewBox="0 0 24 24" 
                className={`w-6 h-6 ${currentPage === 'reels' ? 'text-blue-700' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM10 17V7l6 5-6 5z" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className="p-2 rounded-full hover:bg-green-50 transition-all duration-300"
            >
              <User className={`w-6 h-6 ${currentPage === 'profile' ? 'text-blue-700' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
