import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostStore } from '../store/postStore';
import PostCard from '../components/posts/PostCard';
import PopularTags from '../components/posts/PopularTags';
import Loading from '../components/common/Loading';
import { PenSquare } from 'lucide-react';

const Home = () => {
  const { posts, pagination, loading, error, getPosts } = usePostStore();
  const [page, setPage] = useState(1);
  const location = useLocation();

  const tag = new URLSearchParams(location.search).get('tag');

  useEffect(() => {
    getPosts(page, 10, tag);
  }, [getPosts, page, tag]);

  const loadMore = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const pageTitle = tag ? `Posts tagged: ${tag}` : 'Latest Posts';

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Hero section */}
          {!tag && (
            <div className="bg-blue-50 rounded-lg p-8 mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
                Emphasizes the natural stream of ideas and creativity.
              </h1>
              <p className="text-gray-600 mb-6">
                A platform where readers find dynamic thinking, and where expert
                and undiscovered voices can share their writing.
              </p>
             

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-md bg-teal-600 text-white hover:bg-teal-700 font-medium h-10 px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ring-offset-white"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Posts section */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-6">
              {pageTitle}
            </h2>

            {loading && page === 1 ? (
              <Loading />
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md text-red-600">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium text-gray-600 mb-4">
                  No posts found
                </h3>
                <p className="text-gray-500 mb-6">
                  {tag
                    ? `There are no posts with the tag "${tag}" yet.`
                    : 'No posts have been published yet.'}
                </p>
                <Link
                  to="/create-post"
                  className="inline-flex items-center justify-center rounded-md bg-teal-600 text-white hover:bg-teal-700 font-medium h-10 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ring-offset-white"
                >
                  <PenSquare className="h-5 w-5 mr-2" />
                  Create a Post
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={loadMore}
                      disabled={page >= pagination.totalPages || loading}
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 font-medium h-12 px-6 text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700"
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
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PopularTags />

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">About</h3>
            <p className="text-gray-600 text-sm mb-4">
              MindFlow is a platform for discovering and sharing ideas. Here,
              you can read and write on the topics that matter to you.
            </p>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
