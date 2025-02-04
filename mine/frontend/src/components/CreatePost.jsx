import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

const CreatePost = ({ onBack }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement post creation
    console.log('Image:', image);
    console.log('Caption:', caption);
    onBack();
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold">New Post</h1>
        <button
          onClick={handleSubmit}
          className="text-blue-500 font-medium"
          disabled={!image}
        >
          Share
        </button>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        {!image ? (
          <label className="block w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="h-full flex flex-col items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Click to upload an image</p>
            </div>
          </label>
        ) : (
          <div className="relative aspect-square mb-4">
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Caption */}
      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
        rows={4}
      />
    </div>
  );
};

export default CreatePost;
