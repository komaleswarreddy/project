import { useState, FC, useEffect } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  onBack: () => void;
}

const categories = ['Travel', 'Architecture', 'Music', 'Dance', 'Art', 'Food', 'Technology'];

// Category mapping based on keywords
const categoryMapping: { [key: string]: string } = {
  photography: 'Art',
  dance: 'Dance',
  tokyo: 'Travel',
  japan: 'Travel',
  architecture: 'Architecture',
  buildings: 'Architecture',
  foodie: 'Food',
  travel: 'Travel'
};

const allResults: Array<{ id: number; type: string; username?: string; fullName?: string; avatar?: string; followers?: string; name?: string; posts?: string; category: string }> = [
  { id: 1, type: 'user', username: 'travel_lisa', fullName: 'Lisa Travel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', followers: '12.5k', category: categoryMapping['travel'] },
  { id: 2, type: 'hashtag', name: 'photography', posts: '2.3M', category: categoryMapping['photography'] },
  { id: 3, type: 'location', name: 'Tokyo, Japan', posts: '1.1M', category: categoryMapping['tokyo'] },
  { id: 4, type: 'user', username: 'architecture_hub', fullName: 'Architecture Hub', avatar: 'https://images.unsplash.com/photo-1528747045269-390fe33c19f3?w=150', followers: '20k', category: categoryMapping['architecture'] },
  { id: 5, type: 'hashtag', name: 'architecture_design', posts: '850k', category: categoryMapping['architecture'] },
  { id: 6, type: 'user', username: 'dance_john', fullName: 'John Dance', avatar: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=150', followers: '8.2k', category: categoryMapping['dance'] },
  { id: 7, type: 'hashtag', name: 'modern_buildings', posts: '720k', category: categoryMapping['buildings'] },
  { id: 8, type: 'user', username: 'foodie_mark', fullName: 'Mark the Foodie', avatar: 'https://images.unsplash.com/photo-1543352634-5ebfd5a59157?w=150', followers: '5.7k', category: categoryMapping['foodie'] }
];

const Search: FC<SearchProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState(allResults);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = () => {
      const filteredResults = allResults.filter(result => {
        const matchesCategory = selectedCategory ? result.category === selectedCategory : true;
        const matchesQuery = searchQuery ? 
          (result.username ? result.username.toLowerCase().includes(searchQuery.toLowerCase()) : 
          result.name?.toLowerCase().includes(searchQuery.toLowerCase())) 
          : true;
        return matchesCategory && matchesQuery;
      });
      setSearchResults(filteredResults);
    };
    fetchResults();
  }, [searchQuery, selectedCategory]);

  const handleHashtagClick = (item: { name: string; type: string; posts?: string }) => {
    if (item.type === 'hashtag' || item.type === 'location') {
      setSelectedHashtag(item.name);  // Show content related to the hashtag or location
    }
  };

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

        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              className={`px-6 py-2 rounded-full ${category === selectedCategory ? 'bg-blue-800' : 'bg-green-600'} text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {selectedHashtag ? (
        <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-green-100 shadow-sm">
          <h2 className="text-lg font-semibold">Content for #{selectedHashtag}</h2>
          {/* Show content related to the selected hashtag here */}
          <p>Here you can show posts, users, or other related content for the selected hashtag.</p>
          <button onClick={() => setSelectedHashtag(null)} className="text-blue-500">Back to Search</button>
        </div>
      ) : (
        <div className="space-y-2">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-green-100 shadow-sm flex items-center space-x-4 hover:bg-white/80 transition-colors cursor-pointer"
              onClick={() => handleHashtagClick(result as { name: string; type: string; posts?: string })}  // Casting result explicitly
            >
              {result.username && (
                <>
                  <img src={result.avatar} alt={result.username} className="w-12 h-12 rounded-full object-cover border border-green-200" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{result.username}</h3>
                    <p className="text-sm text-gray-500">{result.fullName}</p>
                    <p className="text-xs text-gray-400">{result.followers} followers</p>
                  </div>
                </>
              )}
              {result.name && (
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">#{result.name}</h3>
                  <p className="text-xs text-gray-400">{result.posts} posts</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
