import { useState, useEffect, useRef } from 'react';
import { Home, Search as SearchIcon, Send, User } from 'lucide-react';
import Typed from 'typed.js';
import Feed from './components/Feed';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Search from './components/Search';
import Addpost from './components/AddPost';
import Reels from './components/Reels';
import CreatePost from './components/CreatePost';
import Displaystory from './components/Displaystory';
import Chats from './components/Chats';

function App() {
  const [currentPage, setCurrentPage] = useState<'feed' | 'messages' | 'profile' | 'search' | 'addPost' | 'reels' | 'createPost' | 'displaystory' | 'chats'>('feed');
  const [selectedStory, setSelectedStory] = useState<any>(null); // State to hold the selected story
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
              <Send className={`w-5 h-5 ${currentPage === 'messages' ? 'text-blue-700' : 'text-gray-500'}`} />
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
                <path d="M2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0zM12 2.5A9.5 9.5 0 002.5 12a9.5 9.5 0 0019 0A9.5 9.5 0 0012 2.5zm0 14.25a4.75 4.75 0 110-9.5 4.75 4.75 0 010 9.5z" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className="p-2 rounded-full hover:bg-green-50 transition-all duration-300"
            >
              <User  className={`w-6 h-6 ${currentPage === 'profile' ? 'text-blue-700' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;