import React, { useState } from 'react';
import { ArrowLeft, Image, Video, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Addpost = ({ onBack }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState('');

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Math.random().toString(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const filtered = prev.filter(file => file.id !== id);
      // Revoke the URL to prevent memory leaks
      const removed = prev.find(file => file.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return filtered;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      selectedFiles.forEach((fileObj, index) => {
        formData.append('files', fileObj.file);
      });
      formData.append('caption', caption);

      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post created successfully!');
      onBack();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold">Create Post</h1>
        <button
          onClick={handleSubmit}
          className="text-blue-500 font-medium disabled:text-gray-400"
          disabled={selectedFiles.length === 0}
        >
          Share
        </button>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        {selectedFiles.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <div className="flex space-x-4 mb-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    multiple
                  />
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                    <Image className="w-5 h-5" />
                    <span>Photo</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    multiple
                  />
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                    <Video className="w-5 h-5" />
                    <span>Video</span>
                  </div>
                </label>
              </div>
              <p className="text-gray-500 text-sm text-center">
                Share photos and videos
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {selectedFiles.map(file => (
              <div key={file.id} className="relative">
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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

export default Addpost;
