import { useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import api from '../utils/axios';
import AddStory from './AddStory';
import toast from 'react-hot-toast';

export default function Stories({ stories, currentUser, onStoriesUpdate }) {
  const [showAddStory, setShowAddStory] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleStoryView = async (storyId) => {
    try {
      await api.patch(`/stories/${storyId}/view`);
      setActiveStory(stories.find(s => s._id === storyId));
    } catch (error) {
      console.error('Error viewing story:', error);
      toast.error('Failed to view story');
    }
  };

  const handleCloseStory = (e) => {
    // Close if clicking the background or close button
    if (e.target === e.currentTarget || e.target.closest('.close-button')) {
      setActiveStory(null);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Add Story Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowAddStory(true)}
              className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
            >
              <PlusIcon className="h-6 w-6 text-emerald-500" />
            </button>
            <p className="text-xs text-center mt-1">Add Story</p>
          </div>

          {/* Story List */}
          {stories.map((story) => (
            <div key={story._id} className="flex-shrink-0">
              <button
                onClick={() => handleStoryView(story._id)}
                className="w-16 h-16 rounded-full border-2 border-emerald-500 overflow-hidden focus:outline-none"
              >
                <img
                  src={`http://localhost:5000${story.media}`}
                  alt={story.user.username}
                  className="w-full h-full object-cover"
                />
              </button>
              <p className="text-xs text-center mt-1">{story.user.username}</p>
            </div>
          ))}
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-1"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-1"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Add Story Modal */}
      {showAddStory && (
        <AddStory
          isOpen={showAddStory}
          onClose={() => setShowAddStory(false)}
          onStoryCreated={onStoriesUpdate}
        />
      )}

      {/* View Story Modal */}
      {activeStory && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleCloseStory}
        >
          <div className="max-w-3xl w-full mx-4 relative">
            {/* Close button */}
            <button
              className="absolute -top-12 right-2 text-white hover:text-gray-300 close-button z-50"
              onClick={handleCloseStory}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Story content */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div className="aspect-w-9 aspect-h-16 sm:aspect-w-4 sm:aspect-h-3">
                {activeStory.type === 'video' ? (
                  <video
                    src={`http://localhost:5000${activeStory.media}`}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={`http://localhost:5000${activeStory.media}`}
                    alt={activeStory.user.username}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Story info */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <img
                  src={`http://localhost:5000${activeStory.user.profilePicture}`}
                  alt={activeStory.user.username}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span className="text-white font-medium">
                  {activeStory.user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
