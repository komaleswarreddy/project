import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Displaystory = ({ story, onBack }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          onBack();
          return prev;
        }
        return prev + 1;
      });
    }, 30); // 3 seconds total duration

    return () => clearInterval(timer);
  }, [onBack]);

  const isVideo = story.storyImages.endsWith('.mp4');

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onBack}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* User info */}
      <div className="absolute top-6 left-4 flex items-center">
        <img
          src={story.avatar}
          alt={story.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="ml-2 text-white font-medium">{story.username}</span>
      </div>

      {/* Story content */}
      <div className="w-full h-full flex items-center justify-center">
        {isVideo ? (
          <video
            src={story.storyImages}
            className="max-h-full max-w-full object-contain"
            autoPlay
            controls={false}
            muted
          />
        ) : (
          <img
            src={story.storyImages}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default Displaystory;
