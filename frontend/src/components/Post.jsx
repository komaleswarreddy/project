import { useState } from 'react';
import { HeartIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import api from '../utils/axios';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Post({ post, currentUser, onPostUpdate }) {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await api.patch(`/posts/${post._id}/like`);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await api.post(`/posts/${post._id}/comments`, { text: comment });
      setComment('');
      onPostUpdate();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img
          src={`http://localhost:5000${post.user.profilePicture}`}
          alt={post.user.username}
          className="h-8 w-8 rounded-full"
        />
        <div className="ml-3">
          <p className="font-medium text-sm">{post.user.username}</p>
          {post.location && (
            <p className="text-xs text-gray-500">{post.location}</p>
          )}
        </div>
      </div>

      {/* Post Image */}
      <img
        src={`http://localhost:5000${post.media}`}
        alt="Post"
        className="w-full object-cover"
        style={{ maxHeight: '32rem' }}
      />

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className="focus:outline-none">
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            )}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="focus:outline-none"
          >
            <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Likes Count */}
        <p className="mt-2 text-sm font-medium">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        {post.caption && (
          <p className="mt-2 text-sm">
            <span className="font-medium">{post.user.username}</span>{' '}
            {post.caption}
          </p>
        )}

        {/* Timestamp */}
        <p className="mt-1 text-xs text-gray-500">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4">
            <div className="max-h-40 overflow-y-auto">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-2 mb-2">
                  <img
                    src={`http://localhost:5000${comment.user.profilePicture}`}
                    alt={comment.user.username}
                    className="h-6 w-6 rounded-full"
                  />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{comment.user.username}</span>{' '}
                      {comment.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 block w-full min-w-0 rounded-md text-sm"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
