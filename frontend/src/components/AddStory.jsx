import { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function AddStory({ isOpen, onClose, onStoryCreated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For video files, create a URL
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('media', selectedFile);

    try {
      await api.post('/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Story added successfully!');
      onStoryCreated();
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error(error.response?.data?.message || 'Error creating story');
    } finally {
      setIsLoading(false);
      // Clean up video URL if it exists
      if (selectedFile?.type.startsWith('video/')) {
        URL.revokeObjectURL(preview);
      }
    }
  };

  const handleClose = () => {
    // Clean up video URL if it exists
    if (selectedFile?.type.startsWith('video/')) {
      URL.revokeObjectURL(preview);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add Story</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="story-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Select a photo or video
                  </span>
                  <input
                    id="story-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-w-9 aspect-h-16 bg-black rounded-lg overflow-hidden">
                {selectedFile?.type.startsWith('video/') ? (
                  <video
                    src={preview}
                    className="w-full h-full object-contain"
                    controls
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (selectedFile?.type.startsWith('video/')) {
                    URL.revokeObjectURL(preview);
                  }
                  setSelectedFile(null);
                  setPreview('');
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75"
                disabled={isLoading}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading || !selectedFile
                ? 'bg-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              }`}
          >
            {isLoading ? 'Adding Story...' : 'Add Story'}
          </button>
        </form>
      </div>
    </div>
  );
}
