import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import {
  Heart,
  MessageSquare,
  ThumbsDown,
  Edit,
  Trash,
  User,
  Share2,
} from 'lucide-react';
import { likePost, dislikePost, deletePost } from '../../api/posts';
import toast from 'react-hot-toast';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import { useCommentStore } from '../../store/commentStore';

const PostDetail = ({ post, onUpdatePost }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { comments, getComments } = useCommentStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      // Get comments for the post
      getComments(post._id);

      // Check if user has liked or disliked the post
      if (user && post.likes) {
        setIsLiked(post.likes.some((like) => like._id === user._id));
        setLikesCount(post.likes.length);
      }

      if (user && post.dislikes) {
        setIsDisliked(
          post.dislikes.some((dislike) => dislike._id === user._id)
        );
        setDislikesCount(post.dislikes.length);
      }
    }
  }, [post, user, getComments]);

  if (!post) {
    return null;
  }

  const { _id, title, content, image, author, tags, createdAt } = post;

  // Format date
  const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');

  // Check if current user is the author
  const isAuthor = user && author._id === user._id;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    setIsLoading(true);

    try {
      await likePost(_id);

      // Update UI
      if (isLiked) {
        // Unlike
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        // Like and remove dislike if exists
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);

        if (isDisliked) {
          setIsDisliked(false);
          setDislikesCount((prev) => prev - 1);
        }
      }

      // Update post data in parent component
      if (onUpdatePost) {
        onUpdatePost();
      }
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike posts');
      return;
    }

    setIsLoading(true);

    try {
      await dislikePost(_id);

      // Update UI
      if (isDisliked) {
        // Remove dislike
        setIsDisliked(false);
        setDislikesCount((prev) => prev - 1);
      } else {
        // Dislike and remove like if exists
        setIsDisliked(true);
        setDislikesCount((prev) => prev + 1);

        if (isLiked) {
          setIsLiked(false);
          setLikesCount((prev) => prev - 1);
        }
      }

      // Update post data in parent component
      if (onUpdatePost) {
        onUpdatePost();
      }
    } catch (error) {
      toast.error('Failed to dislike post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${_id}`);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await deletePost(_id);
      toast.success('Post deleted successfully');
      navigate('/feed');
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title,
          text: `Check out this post: ${title}`,
          url,
        })
        .catch((err) => {
          console.error('Error sharing:', err);
        });
    } else {
      // Fallback to clipboard
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  return (
    <article className="animate-[slideUp_0.5s_ease-out]">
      {/* Post header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
          {title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to={`/profile/${author._id}`}
              className="flex items-center group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {author.avatar ? (
                  <img
                    src={`http://localhost:5000${author.avatar}`}
                    alt={author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div className="ml-3">
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {author.username}
                </span>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
            </Link>
          </div>

          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                title="Edit post"
              >
                <Edit className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                title="Delete post"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Post image */}
      {image && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={`http://localhost:5000${image}`}
            alt={title}
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Post tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <Link
              key={index}
              to={`/?tag=${tag}`}
              className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Post content */}
      <div className="prose prose-lg prose-blue max-w-none mb-8">
        {content
          .split('\n')
          .map((paragraph, index) =>
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          )}
      </div>

      {/* Post actions */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${
              isLiked
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleDislike}
            disabled={isLoading}
            className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${
              isDisliked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ThumbsDown className="h-5 w-5" />
            <span>{dislikesCount}</span>
          </button>

          <button className="flex items-center space-x-1 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <MessageSquare className="h-5 w-5" />
            <span>{comments.length}</span>
          </button>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          title="Share post"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Comments section */}
      <div className="mt-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-6">
          Comments
        </h3>

        {isAuthenticated ? (
          <CommentForm postId={_id} />
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-600">
              Please{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700">
                log in
              </Link>{' '}
              to comment on this post.
            </p>
          </div>
        )}

        <CommentList comments={comments} postId={_id} />
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-[fadeIn_0.3s_ease-in-out]">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="h-10 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors w-full"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="h-10 px-4 py-2 border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-100 rounded-md transition-colors w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostDetail;
