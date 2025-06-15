import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getPost, updatePost } from '../api/posts';
import PostForm from '../components/posts/PostForm';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPost(id);
        
        // Check if current user is the author
        if (user._id !== response.post.author._id) {
          toast.error('You are not authorized to edit this post');
          navigate(`/post/${id}`);
          return;
        }
        
        setPost(response.post);
      } catch (error) {
        setError(error.message || 'Failed to fetch post');
        toast.error('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, user, navigate]);
  
  const handleUpdate = async (postData) => {
    return await updatePost(id, postData);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Edit Post
        </h1>
        
        <PostForm 
          initialData={post} 
          onSubmit={handleUpdate} 
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditPost;