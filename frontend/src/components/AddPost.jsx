import { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function AddPost({ isOpen, onClose, onPostCreated }) {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('media', selectedFile);
    formData.append('caption', caption);
    if (location) formData.append('location', location);

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post created successfully!');
      onPostCreated();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Error creating post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Select a photo
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg"
                style={{ maxHeight: '32rem', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview('');
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                Caption
              </label>
              <textarea
                id="caption"
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="Write a caption..."
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="Add location"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
