import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePostStore } from '../store/postStore';
import PostDetail from '../components/posts/PostDetail';
import Loading from '../components/common/Loading';
import PopularTags from '../components/posts/PopularTags';

const PostDetailPage = () => {
  const { id } = useParams();
  const { currentPost, loading, error, getPost } = usePostStore();

  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    getPost(id);
  }, [getPost, id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Post not found</h3>
          <p className="text-gray-500">
            The post you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PostDetail post={currentPost} onUpdatePost={() => getPost(id)} />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">About the author</h3>
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                {currentPost.author.avatar ? (
                  <img
                    src={`http://localhost:5000${currentPost.author.avatar}`}
                    alt={currentPost.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {currentPost.author.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{currentPost.author.username}</h4>
                {currentPost.author.bio && (
                  <p className="text-sm text-gray-600 mt-1">{currentPost.author.bio}</p>
                )}
              </div>
            </div>
          </div>

          <PopularTags />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;