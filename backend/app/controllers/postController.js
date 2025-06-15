import Post from '../models/Post.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a post
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Create post data
    const postData = {
      title,
      content,
      author: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };
    
    // Add image if uploaded
    if (req.file) {
      postData.image = `/uploads/posts/${req.file.filename}`;
    }
    
    const post = await Post.create(postData);
    
    // Populate author data
    await post.populate('author', 'username avatar');
    
    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Get all posts (with pagination)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;
    
    // Build query
    const query = {};
    if (tag) {
      query.tags = tag;
    }
    
    // Get posts
    const posts = await Post.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar')
      .populate({
        path: 'likes',
        select: '_id'
      });
    
    // Get total count
    const totalPosts = await Post.countDocuments(query);
    
    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get posts from followed users
export const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get posts from followed users
    const posts = await Post.find({
      author: { $in: req.user.following }
    })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar')
      .populate({
        path: 'likes',
        select: '_id'
      });
    
    // Get total count
    const totalPosts = await Post.countDocuments({
      author: { $in: req.user.following }
    });
    
    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feed posts',
      error: error.message
    });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate({
        path: 'likes',
        select: '_id'
      })
      .populate({
        path: 'dislikes',
        select: '_id'
      });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check post ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    const { title, content, tags } = req.body;
    
    // Update post data
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
    
    // Handle image update
    if (req.file) {
      // Remove old image if it exists
      if (post.image) {
        try {
          const oldImagePath = path.join(__dirname, '..', post.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error removing old image:', err);
        }
      }
      
      updateData.image = `/uploads/posts/${req.file.filename}`;
    }
    
    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');
    
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check post ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }
    
    // Remove image if it exists
    if (post.image) {
      try {
        const imagePath = path.join(__dirname, '..', post.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error removing image:', err);
      }
    }
    
    await post.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if already liked
    const alreadyLiked = post.likes.includes(req.user._id);
    
    // Handle like toggle
    if (alreadyLiked) {
      // Unlike post
      await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Post unliked successfully'
      });
    }
    
    // Remove from dislikes if present
    const alreadyDisliked = post.dislikes.includes(req.user._id);
    if (alreadyDisliked) {
      await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { dislikes: req.user._id } }
      );
    }
    
    // Add to likes
    await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { likes: req.user._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Post liked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
};

// Dislike post
export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if already disliked
    const alreadyDisliked = post.dislikes.includes(req.user._id);
    
    // Handle dislike toggle
    if (alreadyDisliked) {
      // Remove dislike
      await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { dislikes: req.user._id } }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Dislike removed successfully'
      });
    }
    
    // Remove from likes if present
    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } }
      );
    }
    
    // Add to dislikes
    await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { dislikes: req.user._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Post disliked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error disliking post',
      error: error.message
    });
  }
};

// Get popular tags
export const getPopularTags = async (req, res) => {
  try {
    const posts = await Post.find().select('tags');
    
    // Count tag occurrences
    const tagCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Convert to array and sort
    const tags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    res.status(200).json({
      success: true,
      tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular tags',
      error: error.message
    });
  }
};