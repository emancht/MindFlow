import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { useCommentStore } from '../../store/commentStore';
import { User, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentList = ({ comments, postId }) => {
  const { user } = useAuthStore();
  const { deleteComment } = useCommentStore();
  
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const formattedDate = format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a');
        const isAuthor = user && comment.author._id === user._id;
        
        return (
          <div
            key={comment._id}
            className="bg-gray-50 rounded-lg p-4 animate-[fadeIn_0.3s_ease-in-out]"
          >
            <div className="flex justify-between">
              <div className="flex items-start">
                <Link to={`/profile/${comment.author._id}`} className="mr-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {comment.author.avatar ? (
                      <img
                        src={`http://localhost:5000${comment.author.avatar}`}
                        alt={comment.author.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </Link>

                <div>
                  <div className="flex items-center mb-1">
                    <Link
                      to={`/profile/${comment.author._id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {comment.author.username}
                    </Link>
                    <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
                  </div>

                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>

              {isAuthor && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete comment"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
