import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Create comment
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    
    // Check if post exists
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Create comment
    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id
    });
    
    // Populate author data
    await comment.populate('author', 'username avatar');
    
    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    // Check if post exists
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get comments
    const comments = await Comment.find({ post: postId })
      .sort('-createdAt')
      .populate('author', 'username avatar');
    
    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check comment ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    await comment.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};