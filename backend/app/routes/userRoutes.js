import express from 'express';
import {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getUserSuggestions
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/uploads.js';

const router = express.Router();

// User routes
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, uploadAvatar, updateProfile);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/suggestions', protect, getUserSuggestions);

export default router;