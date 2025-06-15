import User from '../models/User.js';
import Post from '../models/Post.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otp')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
      
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's posts
    const posts = await Post.find({ author: user._id })
      .sort('-createdAt')
      .populate('author', 'username avatar');
    
    res.status(200).json({
      success: true,
      user,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    
    // Check if username already exists
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    
    // Add avatar path if image was uploaded
    if (req.file) {
      // Remove old avatar if it exists
      if (req.user.avatar) {
        try {
          const oldAvatarPath = path.join(__dirname, '..', req.user.avatar);
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        } catch (err) {
          console.error('Error removing old avatar:', err);
        }
      }
      
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -otp');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    // Cannot follow yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }
    
    const userToFollow = await User.findById(req.params.id);
    
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if already following
    const isFollowing = req.user.following.includes(req.params.id);
    
    if (isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }
    
    // Add to current user's following and to target user's followers
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.params.id } }
    );
    
    await User.findByIdAndUpdate(
      req.params.id,
      { $push: { followers: req.user._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error following user',
      error: error.message
    });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    // Cannot unfollow yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot unfollow yourself'
      });
    }
    
    const userToUnfollow = await User.findById(req.params.id);
    
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if actually following
    const isFollowing = req.user.following.includes(req.params.id);
    
    if (!isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      });
    }
    
    // Remove from current user's following and from target user's followers
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.params.id } }
    );
    
    await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.user._id } }
    );
    
    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unfollowing user',
      error: error.message
    });
  }
};

// Get user suggestions (users to follow)
export const getUserSuggestions = async (req, res) => {
  try {
    // Get users that the current user is not following
    const users = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.following },
      isVerified: true
    })
    .select('username avatar bio')
    .limit(5);
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user suggestions',
      error: error.message
    });
  }
};