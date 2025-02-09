import { useState, FC } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  onBack: () => void;
}

const categories = ['Travel', 'Architecture', 'Music', 'Dance', 'Art', 'Food', 'Technology'];

const searchResults = [
  {
    id: 1,
    type: 'user',
    username: 'travel_lisa',
    fullName: 'Lisa Travel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    followers: '12.5k'
  },
  {
    id: 2,
    type: 'hashtag',
    name: 'photography',
    posts: '2.3M'
  },
  {
    id: 3,
    type: 'location',
    name: 'Tokyo, Japan',
    posts: '1.1M'
  }
];

const Search: FC<SearchProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-green-100 shadow-sm mb-4">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/50 border border-green-100 rounded-full focus:outline-none focus:border-blue-400 transition-colors"
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-2">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-green-100 shadow-sm flex items-center space-x-4 hover:bg-white/80 transition-colors cursor-pointer"
          >
            {result.type === 'user' && (
              <>
                <img
                  src={result.avatar}
                  alt={result.username}
                  className="w-12 h-12 rounded-full object-cover border border-green-200"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{result.username}</h3>
                  <p className="text-sm text-gray-500">{result.fullName}</p>
                  <p className="text-xs text-gray-400">{result.followers} followers</p>
                </div>
              </>
            )}
            {result.type === 'hashtag' && (
              <div className="flex-1">
                <h3 className="font-semibold text-sm">#{result.name}</h3>
                <p className="text-xs text-gray-400">{result.posts} posts</p>
              </div>
            )}
            {result.type === 'location' && (
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{result.name}</h3>
                <p className="text-xs text-gray-400">{result.posts} posts</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;