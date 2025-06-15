import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostStore } from '../../store/postStore';
import { Tag } from 'lucide-react';

const PopularTags = () => {
  const { popularTags, getPopularTags } = usePostStore();
  const location = useLocation();
  
  useEffect(() => {
    getPopularTags();
  }, [getPopularTags]);
  
  // Get current tag from URL if present
  const currentTag = new URLSearchParams(location.search).get('tag');
  
  if (!popularTags || popularTags.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center mb-4">
        <Tag className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="font-medium text-gray-900">Popular Tags</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {popularTags.map(({ tag, count }, index) => (
          <Link 
            key={index} 
            to={`/?tag=${tag}`}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              currentTag === tag
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag}
            <span className="ml-1 text-xs opacity-70">({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;