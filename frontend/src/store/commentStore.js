import { create } from 'zustand';
import { 
  getComments as getCommentsApi,
  createComment as createCommentApi,
  deleteComment as deleteCommentApi
} from '../api/comments';

export const useCommentStore = create((set, get) => ({
  comments: [],
  loading: false,
  error: null,
  
  // Get comments for a post
  getComments: async (postId) => {
    try {
      set({ loading: true, error: null });
      const data = await getCommentsApi(postId);
      set({ 
        comments: data.comments, 
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch comments', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Create comment
  createComment: async (postId, content) => {
    try {
      set({ loading: true, error: null });
      const data = await createCommentApi(postId, content);
      set({ 
        comments: [data.comment, ...get().comments], 
        loading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create comment', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Delete comment
  deleteComment: async (commentId) => {
    try {
      set({ loading: true, error: null });
      await deleteCommentApi(commentId);
      set({ 
        comments: get().comments.filter(comment => comment._id !== commentId),
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to delete comment', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Clear comments
  clearComments: () => {
    set({ comments: [] });
  },
  
  // Clear errors
  clearError: () => {
    set({ error: null });
  }
}));