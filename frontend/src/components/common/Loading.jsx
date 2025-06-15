import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary-600 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-accent-500 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.7 }}></div>
      </div>
    </div>
  );
};

export default Loading;