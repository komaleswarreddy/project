import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const Search = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfiles, setUserProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/userProfiles');
      setUserProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = userProfiles.filter(profile => 
      profile.username.toLowerCase().includes(term) ||
      profile.fullName.toLowerCase().includes(term)
    );
    setFilteredProfiles(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-4">
        <button onClick={onBack} className="text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      <div className="p-4">
        {filteredProfiles.map(profile => (
          <div key={profile._id} className="flex items-center space-x-4 mb-4">
            <img
              src={profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={profile.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{profile.username}</h3>
              <p className="text-sm text-gray-500">{profile.fullName}</p>
              {profile.bio && (
                <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
