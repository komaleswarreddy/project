import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = ['Travel', 'Architecture', 'Music', 'Dance', 'Art', 'Food'];

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Search Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onClose} className="text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Recent Searches */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent</h3>
          <div className="space-y-4">
            {/* Example recent searches */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img
                    src="/default-avatar.png"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">travel_lisa</p>
                  <p className="text-xs text-gray-500">Lisa Travel</p>
                  <p className="text-xs text-gray-400">12.5k followers</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
