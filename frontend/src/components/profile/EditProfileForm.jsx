import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { updateProfile } from '../../api/users';
import { User, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProfileForm = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || '', bio: user.bio || '' });
      if (user.avatar) {
        setAvatarPreview(`http://localhost:5000${user.avatar}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, avatar: 'Please select an image file' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, avatar: 'Image size should be less than 2MB' });
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      if (errors.avatar) {
        setErrors({ ...errors, avatar: '' });
      }
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(user?.avatar ? `http://localhost:5000${user.avatar}` : null);
    setAvatarFile(null);
    const fileInput = document.getElementById('avatar');
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const profileFormData = new FormData();
      profileFormData.append('username', formData.username);
      profileFormData.append('bio', formData.bio);
      if (avatarFile) profileFormData.append('avatar', avatarFile);

      const response = await updateProfile(profileFormData);
      updateUserProfile(response.user);
      toast.success('Profile updated successfully!');
      navigate(`/profile/${user._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>
          {avatarPreview && avatarFile && (
            <button
              type="button"
              onClick={removeAvatar}
              className="absolute top-0 right-0 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="avatar"
            className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-100 rounded-md cursor-pointer transition"
          >
            Change Avatar
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="sr-only"
          />
        </div>

        {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 w-full h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
            errors.username ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          className="mt-1 w-full min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex justify-center items-center h-12 px-6 text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Save Changes'
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 flex justify-center items-center h-12 px-6 text-lg font-medium border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-100 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
