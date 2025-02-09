import React, { useEffect, useState, FC } from 'react';
import axios from 'axios';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';

interface SearchProps {
  onBack: () => void;
  story:string
}

const Displaystory: FC<SearchProps> = ({ onBack,story }) => {
//   const [story, setStory] = useState<any[]>([]);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/story')
//       .then((response) => {
//         setStory(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching posts:', error);
//       });
//   }, []);

//   console.log(story);

  // Function to determine if the URL is an image or video
  const isImage = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };
  console.log(story)

  return (
    <>
      {story.length > 0 && (
        <div className="max-w-xl mx-auto bg-white/60 backdrop-blur-lg rounded-xl border border-green-100 shadow-sm p-4">
          {/* Back Icon */}
          <div className="flex items-center mb-4">
            <button className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
              <ArrowLeft className="w-6 h-6 text-gray-700 hover:text-blue-500" onClick={onBack} />
            </button>
          </div>

          {/* User Uploaded Content */}
          <div className="text-center">
            {isImage(story) ? (
              <img
                src={story}
                alt="Story content"
                className="w-full h-auto rounded-xl mb-4"
              />
            ) : (
              <video
                src={story}
                className="w-full h-auto rounded-xl mb-4"
                controls
              >
                Your browser does not support the video tag.
              </video>
            )}
            <p className="text-sm text-gray-600">{story[0].caption}</p>
          </div>

          {/* Bottom Icons */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4">
              <button className="p-2 rounded-full border border-green-200 hover:border-red-400 hover:bg-red-50 transition-all duration-300">
                <Heart className="w-5 h-5 text-gray-700 hover:text-red-500" />
              </button>
              <button className="p-2 rounded-full border border-green-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                <MessageCircle className="w-5 h-5 text-gray-700 hover:text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Displaystory;
