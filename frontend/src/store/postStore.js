import { create } from 'zustand';
import { 
  getPosts, 
  getFeedPosts, 
  getPost as getPostApi,
  getPopularTags as getPopularTagsApi
} from '../api/posts';

export const usePostStore = create((set, get) => ({
  posts: [],
  feedPosts: [],
  currentPost: null,
  popularTags: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalPosts: 0
  },
  loading: false,
  error: null,
  
  // Get all posts
  getPosts: async (page = 1, limit = 10, tag = '') => {
    try {
      set({ loading: true, error: null });
      const data = await getPosts(page, limit, tag);
      set({ 
        posts: data.posts, 
        pagination: data.pagination,
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch posts', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Get feed posts
  getFeedPosts: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      const data = await getFeedPosts(page, limit);
      set({ 
        feedPosts: data.posts, 
        pagination: data.pagination,
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch feed posts', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Get single post
  getPost: async (postId) => {
    try {
      set({ loading: true, error: null, currentPost: null });
      const data = await getPostApi(postId);
      set({ 
        currentPost: data.post, 
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch post', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Get popular tags
  getPopularTags: async () => {
    try {
      const data = await getPopularTagsApi();
      set({ popularTags: data.tags });
      return data;
    } catch (error) {
      console.error('Failed to fetch popular tags:', error);
      // Don't update error state to avoid UI disruption
      return { tags: [] };
    }
  },
  
  // Add post to local state
  addPost: (post) => {
    set({ posts: [post, ...get().posts] });
  },
  
  // Update post in local state
  updatePost: (updatedPost) => {
    const posts = get().posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    );
    
    set({ 
      posts,
      currentPost: get().currentPost?._id === updatedPost._id 
        ? updatedPost 
        : get().currentPost
    });
  },
  
  // Remove post from local state
  removePost: (postId) => {
    set({ 
      posts: get().posts.filter(post => post._id !== postId),
      feedPosts: get().feedPosts.filter(post => post._id !== postId)
    });
  },
  
  // Clear current post
  clearCurrentPost: () => {
    set({ currentPost: null });
  },
  
  // Clear errors
  clearError: () => {
    set({ error: null });
  }
}));