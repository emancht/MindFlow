import express from 'express';
import {
  createComment,
  getComments,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Comment routes
router.post('/:postId', protect, createComment);
router.get('/:postId', getComments);
router.delete('/:id', protect, deleteComment);

export default router;