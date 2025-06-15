import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Image, X } from 'lucide-react';

const PostForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    ...initialData
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && initialData.image) {
      setImagePreview(`http://localhost:5000${initialData.image}`);
    }

    if (initialData.tags && Array.isArray(initialData.tags)) {
      setFormData(prev => ({
        ...prev,
        tags: initialData.tags.join(', ')
      }));
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, image: 'Please select an image file' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors({ ...errors, image: '' });
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const postFormData = new FormData();
      postFormData.append('title', formData.title);
      postFormData.append('content', formData.content);
      if (formData.tags) postFormData.append('tags', formData.tags);
      if (imageFile) postFormData.append('image', imageFile);

      await onSubmit(postFormData);
      toast.success(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
      navigate('/feed');
    } catch (error) {
      toast.error(error.message || (isEditing ? 'Failed to update post' : 'Failed to create post'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.title
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-teal-500'
          }`}
          placeholder="Enter a title for your post"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="content"
          name="content"
          rows={10}
          value={formData.content}
          onChange={handleChange}
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.content
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-teal-500'
          }`}
          placeholder="Write your post content here..."
        />
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="technology, programming, web development"
        />
        <p className="mt-1 text-xs text-gray-500">Add relevant tags separated by commas</p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Post Image</label>
        {imagePreview ? (
          <div className="mt-2 relative">
            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-md" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="text-center space-y-1">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload an image</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        )}
        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
      </div>

      {/* Submit & Cancel */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 px-6 text-lg font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isEditing ? 'Update Post' : 'Publish Post'}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 h-12 px-6 text-lg font-medium border border-gray-300 bg-transparent text-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PostForm;
