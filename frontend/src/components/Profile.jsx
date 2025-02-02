import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile({ onClose }) {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put('/profile/update', formData);
      await setUser(response.data.data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      toast.error('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put('/profile/update-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await setUser(response.data.data);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setError(error.message || 'Failed to update profile picture');
      toast.error(error.message || 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 z-50 overflow-y-auto"
    >
      {/* Header */}
      <header className="border-b border-teal-200 sticky top-0 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="text-teal-600 hover:bg-teal-100 p-2 rounded-full transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-600 bg-clip-text text-transparent">
              {user.username}
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditing(!isEditing);
                setError(null);
              }}
              className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-300 
                ${isEditing 
                  ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:shadow-lg' 
                  : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600'} 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-lg"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Info */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative flex flex-col md:flex-row md:items-center md:space-x-8 mb-8 p-8 bg-white rounded-3xl shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 rounded-3xl"></div>
          <div className="relative group mb-6 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={`http://localhost:5000${user.profilePicture}`}
                alt={user.username}
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-white shadow-2xl transform transition duration-500"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label className={`w-full h-full cursor-pointer flex items-center justify-center bg-black bg-opacity-50 rounded-full transition-all duration-300 hover:bg-opacity-70 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={loading}
                    />
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </label>
                </div>
              )}
            </motion.div>
          </div>
          <div className="relative grid grid-cols-3 gap-6 w-full md:w-auto">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02, rotateX: 5 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative h-full bg-gradient-to-br from-white via-white to-teal-50 rounded-2xl p-1 transition duration-500 group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="relative flex flex-col items-center p-4 bg-white rounded-xl h-full backdrop-blur-sm">
                  <div className="mb-2">
                    <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM7 10a2 2 0 11-4 0 2 2 0 014 0zM15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <motion.div 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="font-bold text-4xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent"
                  >
                    {user.stats?.postsCount || 0}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 mt-1 tracking-wider uppercase">Posts</div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.02, rotateX: 5 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative h-full bg-gradient-to-br from-white via-white to-emerald-50 rounded-2xl p-1 transition duration-500 group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="relative flex flex-col items-center p-4 bg-white rounded-xl h-full backdrop-blur-sm">
                  <div className="mb-2">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <motion.div 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="font-bold text-4xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
                  >
                    {user.stats?.followersCount || 0}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 mt-1 tracking-wider uppercase">Followers</div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.02, rotateX: 5 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative h-full bg-gradient-to-br from-white via-white to-cyan-50 rounded-2xl p-1 transition duration-500 group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="relative flex flex-col items-center p-4 bg-white rounded-xl h-full backdrop-blur-sm">
                  <div className="mb-2">
                    <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <motion.div 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="font-bold text-4xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    {user.stats?.followingCount || 0}
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600 mt-1 tracking-wider uppercase">Following</div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleProfileUpdate}
              className="relative space-y-6 p-8 bg-white rounded-3xl shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 rounded-3xl"></div>
              <div className="relative space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-white shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-white shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 resize-none"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-white shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-transparent bg-white shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                    disabled={loading}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`relative w-full py-4 px-6 overflow-hidden group rounded-xl font-medium 
                    bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white shadow-xl
                    hover:shadow-2xl transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  <span className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></span>
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating Profile...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-8 bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 rounded-3xl"></div>
              <div className="relative space-y-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-600 bg-clip-text text-transparent">
                    {formData.name}
                  </h2>
                  <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                    {formData.bio || 'No bio added yet'}
                  </p>
                </div>
                {formData.location && (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-600 group"
                  >
                    <div className="p-2 rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="ml-3 text-lg">{formData.location}</span>
                  </motion.div>
                )}
                {formData.website && (
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center group"
                  >
                    <div className="p-2 rounded-lg bg-cyan-100 group-hover:bg-cyan-200 transition-colors duration-300">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <a 
                      href={formData.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-3 text-lg text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
                    >
                      {formData.website}
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
