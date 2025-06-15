import express from 'express';
import { 
  register, 
  verifyOTP, 
  resendOTP, 
  login, 
  logout, 
  getCurrentUser 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getCurrentUser);

export default router;