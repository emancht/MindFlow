import express from 'express';
import {
  createPost,
  getPosts,
  getFeedPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  getPopularTags
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { uploadPostImage } from '../middleware/uploads.js';

const router = express.Router();

// Post routes
router.post('/', protect, uploadPostImage, createPost);
router.get('/', getPosts);
router.get('/feed', protect, getFeedPosts);
router.get('/tags', getPopularTags);
router.get('/:id', getPost);
router.put('/:id', protect, uploadPostImage, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, dislikePost);

export default router;