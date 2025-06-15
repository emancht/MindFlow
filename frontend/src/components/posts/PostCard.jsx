import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useCommentStore } from '../../store/commentStore';
import { Heart, MessageSquare, User } from 'lucide-react';

const PostCard = ({ post }) => {
  const { _id, title, content, image, author, tags, likes, createdAt } = post;
  const { comments } = useCommentStore();

  // Get only comments related to this post
  const commentCount = comments.filter(comment => comment.post === _id).length;

  // Extract first 150 characters as preview
  const contentPreview = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;

  // Format date
  const formattedDate = format(new Date(createdAt), 'MMM d, yyyy');

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 animate-fade-in">
      <Link to={`/post/${_id}`}>
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 overflow-hidden">
          {image ? (
            <img 
              src={`http://localhost:5000${image}`} 
              alt={title}
              className="w-full h-[280px] object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <Link 
                key={index} 
                to={`/?tag=${tag}`}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <Link to={`/post/${_id}`}>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm mb-4">
          {contentPreview}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Link to={`/profile/${author._id}`} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {author.avatar ? (
                  <img 
                    src={`http://localhost:5000${author.avatar}`}
                    alt={author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-gray-500" />
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {author.username}
              </span>
            </Link>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-500">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">{likes ? likes.length : 0}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
