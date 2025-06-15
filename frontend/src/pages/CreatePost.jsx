import React from 'react';
import PostForm from '../components/posts/PostForm';
import { createPost } from '../api/posts';

const CreatePost = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Create a New Post
        </h1>
        
        <PostForm onSubmit={createPost} />
      </div>
    </div>
  );
};

export default CreatePost;