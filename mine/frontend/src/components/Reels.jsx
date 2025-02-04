import React from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';

const Reels = ({ onBack }) => {
  // Mock data for reels
  const reels = [
    {
      id: 1,
      username: 'dance.pro',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      caption: 'New dance routine! 💃 #dance #trending',
      likes: '10.5K',
      comments: '234'
    },
    {
      id: 2,
      username: 'travel.vibes',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      caption: 'Beautiful sunset in Bali 🌅 #travel #bali',
      likes: '8.2K',
      comments: '156'
    }
  ];

  return (
    <div className="h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Reels */}
      <div className="snap-y snap-mandatory h-full overflow-y-scroll">
        {reels.map(reel => (
          <div key={reel.id} className="snap-start h-full relative">
            {/* Video */}
            <video
              src={reel.video}
              className="w-full h-full object-cover"
              loop
              autoPlay
              muted
              playsInline
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
              {/* Actions */}
              <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                <button className="text-white">
                  <Heart className="w-7 h-7" />
                  <span className="text-sm">{reel.likes}</span>
                </button>
                <button className="text-white">
                  <MessageCircle className="w-7 h-7" />
                  <span className="text-sm">{reel.comments}</span>
                </button>
                <button className="text-white">
                  <Share2 className="w-7 h-7" />
                </button>
              </div>

              {/* Caption */}
              <div className="absolute left-4 right-16 bottom-4">
                <p className="text-white font-medium mb-1">{reel.username}</p>
                <p className="text-white text-sm">{reel.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
