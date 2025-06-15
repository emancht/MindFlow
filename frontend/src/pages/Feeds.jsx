import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePostStore } from '../store/postStore';
import { getUserSuggestions, followUser } from '../api/users';
import PostCard from '../components/posts/PostCard';
import PopularTags from '../components/posts/PopularTags';
import Loading from '../components/common/Loading';
import { Bookmark, TrendingUp, User } from 'lucide-react';

const Feeds = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    feedPosts,
    posts,
    pagination,
    currentPage,
    loading,
    error,
    getFeedPosts,
    getPosts,
  } = usePostStore();

  const [activeTab, setActiveTab] = useState(isAuthenticated ? 'feed' : 'discover');
  const [page, setPage] = useState(1);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    if (activeTab === 'feed') {
      getFeedPosts(page);
    } else {
      getPosts(page);
    }
  }, [activeTab, page]);

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await getUserSuggestions();
        setUserSuggestions(res.users);
      } catch (err) {
        console.error('Suggestion Error:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    if (isAuthenticated) fetchUserSuggestions();
  }, [isAuthenticated]);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      setFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error('Follow failed:', err);
    }
  };

  const displayedPosts =
    activeTab === 'feed'
      ? feedPosts.filter((post) => user?.following?.includes(post.author._id))
      : posts.filter((post) => post.author._id === user?._id);

  const loadMore = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-6">
              <button
                className={`pb-4 px-2 ${
                  activeTab === 'feed'
                    ? 'border-b-2 border-green-600 text-green-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setPage(1);
                  setActiveTab('feed');
                }}
              >
                <div className="flex items-center">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Your Feed
                </div>
              </button>
              <button
                className={`pb-4 px-2 ${
                  activeTab === 'discover'
                    ? 'border-b-2 border-green-600 text-green-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setPage(1);
                  setActiveTab('discover');
                }}
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Discover
                </div>
              </button>
            </div>
          </div>

          {/* Post Content */}
          {loading && page === 1 ? (
            <Loading />
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600">{error}</div>
          ) : displayedPosts.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center animate-fade-in">
              <h3 className="text-xl font-medium text-gray-600 mb-4">
                {activeTab === 'feed'
                  ? 'Your feed is empty'
                  : 'No posts found in Discover'}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'feed'
                  ? 'Follow other users to see their posts.'
                  : 'Create a post to appear in Discover.'}
              </p>
              <Link
                to="/create-post"
                className="inline-flex items-center justify-center rounded-md bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700"
              >
                Create Post
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {displayedPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMore}
                    disabled={page >= pagination.totalPages || loading}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Who to Follow</h3>
            {loadingSuggestions ? (
              <p>Loading...</p>
            ) : (
              userSuggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="flex items-center justify-between mb-4"
                >
                  <Link to={`/profile/${suggestion._id}`} className="flex items-center group">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {suggestion.avatar ? (
                        <img
                          src={`http://localhost:5000${suggestion.avatar}`}
                          alt={suggestion.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                        {suggestion.username}
                      </span>
                      {suggestion.bio && (
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">
                          {suggestion.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                  {!following[suggestion._id] ? (
                    <button
                      onClick={() => handleFollow(suggestion._id)}
                      className="ml-4 inline-flex items-center rounded-md bg-teal-600 text-white text-sm px-3 py-1.5 font-medium hover:bg-teal-700 transition"
                    >
                      Follow
                    </button>
                  ) : (
                    <span className="ml-4 text-sm text-gray-400">Following</span>
                  )}
                </div>
              ))
            )}
          </div>

          <PopularTags />
        </div>
      </div>
    </div>
  );
};

export default Feeds;

















// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { usePostStore } from '../store/postStore';
// import PostCard from '../components/posts/PostCard';
// import PopularTags from '../components/posts/PopularTags';

// import Loading from '../components/common/Loading';
// import { PenSquare, Users, User } from 'lucide-react';

// import { getUserSuggestions, followUser } from '../api/users';

// const Feeds = () => {
//   const { user } = useAuthStore();
//   const { feedPosts, pagination, loading, error, getFeedPosts } =
//     usePostStore();
//   const [page, setPage] = useState(1);
//   const [userSuggestions, setUserSuggestions] = useState([]);
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
//   const [following, setFollowing] = useState({});

//   const handleFollow = async (userId) => {
//     try {
//       await followUser(userId);
//       setFollowing((prev) => ({ ...prev, [userId]: true }));
//     } catch (error) {
//       console.error('Failed to follow user:', error);
//     }
//   };

//   useEffect(() => {
//     getFeedPosts(page);
//   }, [getFeedPosts, page]);

//   useEffect(() => {
//     const fetchUserSuggestions = async () => {
//       setLoadingSuggestions(true);
//       try {
//         const response = await getUserSuggestions();
//         setUserSuggestions(response.users);
//       } catch (error) {
//         console.error('Failed to fetch user suggestions:', error);
//       } finally {
//         setLoadingSuggestions(false);
//       }
//     };

//     fetchUserSuggestions();
//   }, []);

//   const loadMore = () => {
//     if (page < pagination.totalPages) {
//       setPage(page + 1);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main content */}
//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-serif font-bold text-gray-900">
//               Your Feed
//             </h2>
//             <Link
//               to="/create-post"
//               className="inline-flex items-center justify-center rounded-md bg-green-600 text-white text-sm h-8 px-3 font-medium transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
//             >
//               <PenSquare className="h-4 w-4 mr-1" />
//               Write
//             </Link>
//           </div>

//           {loading && page === 1 ? (
//             <Loading />
//           ) : error ? (
//             <div className="bg-red-50 p-4 rounded-md text-red-600">{error}</div>
//           ) : feedPosts.length === 0 ? (
//             <div className="bg-gray-50 p-8 rounded-lg text-center animate-fade-in">
//               <h3 className="text-xl font-medium text-gray-600 mb-4">
//                 Your feed is empty
//               </h3>
//               <p className="text-gray-500 mb-6">
//                 Follow other users to see their posts in your feed, or explore
//                 posts from everyone.
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <Link
//                   to="/"
//                   className="inline-flex items-center justify-center rounded-md bg-teal-600 text-white h-10 px-4 font-medium transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
//                 >
//                   <Users className="h-5 w-5 mr-2" />
//                   Explore Posts
//                 </Link>
//                 <Link
//                   to="/create-post"
//                   className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-transparent h-10 px-4 font-medium text-gray-900 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
//                 >
//                   <PenSquare className="h-5 w-5 mr-2" />
//                   Create a Post
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 gap-6">
//                 {feedPosts.map((post) => (
//                   <PostCard key={post._id} post={post} />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <div className="mt-8 flex justify-center">
//                   <button
//                     onClick={loadMore}
//                     disabled={page >= pagination.totalPages || loading}
//                     className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-transparent h-12 px-6 text-lg font-medium text-gray-900 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
//                   >
//                     {loading ? (
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                     ) : (
//                       'Load More'
//                     )}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* User suggestions */}
         
//           {userSuggestions.map((suggestion) => (
//             <div
//               key={suggestion._id}
//               className="flex items-center justify-between"
//             >
//               <Link
//                 to={`/profile/${suggestion._id}`}
//                 className="flex items-center group"
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                   {suggestion.avatar ? (
//                     <img
//                       src={`http://localhost:5000${suggestion.avatar}`}
//                       alt={suggestion.username}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <User className="h-5 w-5 text-gray-500" />
//                   )}
//                 </div>
//                 <div className="ml-3">
//                   <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
//                     {suggestion.username}
//                   </span>
//                   {suggestion.bio && (
//                     <p className="text-xs text-gray-500 truncate max-w-[160px]">
//                       {suggestion.bio}
//                     </p>
//                   )}
//                 </div>
//               </Link>
//               {!following[suggestion._id] ? (
//                 <button
//                   onClick={() => handleFollow(suggestion._id)}
//                   className="ml-4 inline-flex items-center rounded-md bg-teal-600 text-white text-sm px-3 py-1.5 font-medium hover:bg-teal-700 transition"
//                 >
//                   Follow
//                 </button>
//               ) : (
//                 <span className="ml-4 text-sm text-gray-400">Following</span>
//               )}
//             </div>
//           ))}

//           <PopularTags />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feeds;
