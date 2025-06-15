import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { followUser, unfollowUser } from '../../api/users';
import { User, Mail, Users, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileHeader = ({ profile, isOwnProfile, refetchProfile }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(
    user && profile.followers ? profile.followers.some(f => f._id === user._id) : false
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(profile._id);
        toast.success(`Unfollowed ${profile.username}`);
      } else {
        await followUser(profile._id);
        toast.success(`Following ${profile.username}`);
      }

      setIsFollowing(!isFollowing);
      if (refetchProfile) refetchProfile();
    } catch (error) {
      toast.error(error.message || 'Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-6">
          {profile.avatar ? (
            <img
              src={`http://localhost:5000${profile.avatar}`}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-gray-400" />
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              {profile.username}
            </h1>

            <div className="flex justify-center sm:justify-start flex-wrap gap-2 mt-3 sm:mt-0">
              {isOwnProfile ? (
                <Link
                  to="/edit-profile"
                  className="inline-flex items-center justify-center h-8 px-3 text-sm border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center h-8 px-3 text-sm rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
                    isFollowing
                      ? 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-500'
                      : 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500'
                  }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-1" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </>
                  )}
                </button>
              )}

              {!isOwnProfile && (
                <button
                  className="inline-flex items-center justify-center h-8 px-3 text-sm border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Message
                </button>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-gray-600 mt-2 mb-4">
              {profile.bio}
            </p>
          )}

          <div className="flex justify-center sm:justify-start space-x-6 text-sm">
            <div className="text-center">
              <span className="block font-medium text-gray-900">
                {profile.posts?.length || 0}
              </span>
              <span className="text-gray-500">Posts</span>
            </div>
            <div className="text-center">
              <span className="block font-medium text-gray-900">
                {profile.followers?.length || 0}
              </span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="text-center">
              <span className="block font-medium text-gray-900">
                {profile.following?.length || 0}
              </span>
              <span className="text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
