


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/users';
import { useAuthStore } from '../store/authStore';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/posts/PostCard';
import Loading from '../components/common/Loading';
import { PenSquare } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile(id);
      setProfile(response.user);
      setPosts(response.posts);
    } catch (error) {
      setError(error.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const isOwnProfile = user && id === user._id;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-600">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Profile not found</h3>
          <p className="text-gray-500">
            The user profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} refetchProfile={fetchProfile} />

      <div className="mt-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          {isOwnProfile ? 'Your Posts' : `${profile.username}'s Posts`}
        </h2>

        {posts.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No posts yet</h3>
            <p className="text-gray-500 mb-6">
              {isOwnProfile
                ? "You haven't published any posts yet. Start writing to share your ideas!"
                : `${profile.username} hasn't published any posts yet.`}
            </p>
            {isOwnProfile && (
              <a
                href="/create-post"
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-teal-600 text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 h-10 px-4 py-2"
              >
                <PenSquare className="h-5 w-5 mr-2" />
                Create a Post
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
