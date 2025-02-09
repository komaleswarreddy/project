import React, { useState, useRef, useEffect, FC } from 'react';
import { Heart, MessageCircle, Share2, ArrowLeft, Volume2, VolumeX, Music2 } from 'lucide-react';

interface ReelsProps {
  onBack: () => void;
}

const sampleReels = [
  {
    id: 1,
    videoUrl: 'https://v.pinimg.com/videos/mc/720p/f6/88/88/f68888290d70aca3cbd4ad9cd3aa732f.mp4',
    type: 'user',
    username: 'dance_master',
    fullName: 'Lisa Travel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    likes: '12.5k',
    comments: 89,
    caption: 'Amazing dance performance at the college fest! 🎵💃 #IIITverse #DanceFest',
    song: 'Original Sound - dance_master'
  },
  {
    id: 2,
    videoUrl: 'https://v.pinimg.com/videos/mc/720p/11/05/2c/11052c35282355459147eabe31cf3c75.mp4',
    type: 'user',
    username: 'tech_innovator',
    fullName: 'Tech Innovator',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
    likes: '856',
    comments: 45,
    caption: 'Check out our latest tech project! 🚀💻 #Innovation #TechLife',
    song: 'Tech Beats - Future Sound'
  },
  {
    id: 3,
    videoUrl: 'https://v.pinimg.com/videos/mc/720p/fc/07/a8/fc07a8c2a545b31a4baf2262465d11a7.mp4',
    type: 'user',
    username: 'campus_life',
    fullName: 'Campus Life',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    likes: '2.3k',
    comments: 156,
    caption: 'Beautiful sunset at our campus! 🌅 #CampusLife #IIITverse',
    song: 'Sunset Vibes - Nature Sounds'
  }
];

const Reels: FC<ReelsProps> = ({ onBack }) => {
  const [likedReels, setLikedReels] = useState<number[]>([]);
  const [muted, setMuted] = useState(true);
  const [currentReel, setCurrentReel] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const lastScrollTime = useRef(Date.now());
  const scrollCooldown = 200;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (!scrollRef.current || isScrollingRef.current || isRefreshing || 
          now - lastScrollTime.current < scrollCooldown) return;

      lastScrollTime.current = now;
      const direction = e.deltaY > 0 ? 1 : -1;
      
      // Handle first reel scroll up for refresh
      if (currentReel === 0 && direction === -1) {
        handleRefresh();
        return;
      }
      
      // Handle last reel scroll down
      if (currentReel === sampleReels.length - 1 && direction === 1) {
        handleLastReelScroll();
        return;
      }

      const newIndex = Math.max(0, Math.min(currentReel + direction, sampleReels.length - 1));
      if (newIndex !== currentReel) {
        scrollToReel(newIndex);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentReel, isRefreshing]);

  useEffect(() => {
    // Pause all videos except the current one
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      const index = parseInt(id);
      if (index === currentReel) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentReel]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    // Simulate refresh with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    setIsRefreshing(false);
  };

  const handleLastReelScroll = () => {
    if (!scrollRef.current) return;
    
    const scrollElement = scrollRef.current;
    const currentScroll = scrollElement.scrollTop;
    
    // Small bounce effect
    scrollElement.scrollTo({
      top: currentScroll + 20,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      scrollElement.scrollTo({
        top: currentScroll,
        behavior: 'smooth'
      });
    }, 150);
  };

  const scrollToReel = (index: number) => {
    if (!scrollRef.current || isScrollingRef.current) return;
    
    isScrollingRef.current = true;
    const reelHeight = scrollRef.current.clientHeight;
    
    scrollRef.current.scrollTo({
      top: index * reelHeight,
      behavior: 'smooth'
    });
    
    setCurrentReel(index);
    
    // Reset scrolling state after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };

  const handleScroll = () => {
    if (!scrollRef.current || isScrollingRef.current || isRefreshing) return;

    const now = Date.now();
    if (now - lastScrollTime.current < scrollCooldown) return;

    lastScrollTime.current = now;
    const scrollElement = scrollRef.current;
    const reelHeight = scrollElement.clientHeight;
    const scrollPosition = scrollElement.scrollTop;
    const newIndex = Math.round(scrollPosition / reelHeight);
    
    if (newIndex !== currentReel && newIndex >= 0 && newIndex < sampleReels.length) {
      setCurrentReel(newIndex);
    }
  };

  const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent event from bubbling
    
    setMuted(!muted);
  };

  const handleLike = (reelId: number) => {
    setLikedReels(prev =>
      prev.includes(reelId)
        ? prev.filter(id => id !== reelId)
        : [...prev, reelId]
    );

    const heart = document.getElementById(`heart-${reelId}`);
    if (heart) {
      heart.style.transform = 'scale(1.2)';
      setTimeout(() => {
        heart.style.transform = 'scale(1)';
      }, 200);
    }
  };

  return (
    <div className="reels-page">
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 m-2 shadow-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 dark:border-white border-t-transparent" />
          </div>
        </div>
      )}
      
      <div className="reel-header">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reels</h2>
          <div className="w-9 h-9" />
        </div>
      </div>

      <div className="reels-content">
        <div className="reels-container">
          <div 
            ref={scrollRef}
            className="reels-scroll no-scrollbar"
            onScroll={handleScroll}
          >
            {sampleReels.map((reel, index) => (
              <div
                key={reel.id}
                className="reel-item"
              >
                {/* Video with tap handler */}
                <div 
                  className="absolute inset-0 z-10"
                  onClick={toggleMute}
                />
                
                <video
                  ref={el => el && (videoRefs.current[index] = el)}
                  className="video-fit"
                  src={reel.videoUrl}
                  loop
                  playsInline
                  muted={muted}
                />

                {/* Mute Indicator */}
                <div 
                  className="mute-button"
                >
                  {muted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Sound Wave Animation when unmuted */}
                {!muted && index === currentReel && (
                  <div className="absolute bottom-20 right-4 flex items-center space-x-1">
                    <div className="w-1 h-3 bg-white animate-sound-wave-1" />
                    <div className="w-1 h-4 bg-white animate-sound-wave-2" />
                    <div className="w-1 h-5 bg-white animate-sound-wave-3" />
                  </div>
                )}

                {/* Overlay */}
                <div className="reel-overlay" />

                {/* Content */}
                <div className="reel-controls">
                  <div className="flex items-end justify-between">
                    <div className="flex-1 mb-2 mr-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={reel.avatar}
                          alt={reel.username}
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                        />
                        <span className="font-semibold text-sm text-white">{reel.username}</span>
                      </div>
                      <p className="text-sm line-clamp-2 mb-2 text-white/90">{reel.caption}</p>
                      <div className="flex items-center space-x-2">
                        <Music2 className="w-4 h-4 text-white/80" />
                        <span className="text-xs truncate text-white/80">{reel.song}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                      <button
                        onClick={() => handleLike(reel.id)}
                        className="flex flex-col items-center"
                      >
                        <Heart
                          id={`heart-${reel.id}`}
                          className={`w-7 h-7 ${
                            likedReels.includes(reel.id) ? 'text-red-500 fill-current' : 'text-white'
                          } transition-all duration-300`}
                        />
                        <span className="text-xs mt-1 text-white">{reel.likes}</span>
                      </button>

                      <button className="flex flex-col items-center">
                        <MessageCircle className="w-7 h-7 text-white" />
                        <span className="text-xs mt-1 text-white">{reel.comments}</span>
                      </button>

                      <button className="flex flex-col items-center">
                        <Share2 className="w-7 h-7 text-white" />
                        <span className="text-xs mt-1 text-white">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reels;
