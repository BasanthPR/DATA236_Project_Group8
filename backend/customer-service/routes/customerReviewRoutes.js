// routes/customerReviewRoutes.js
import express from 'express';
import { 
  addCustomerReview, 
  getCustomerReviews
} from '../controllers/customerReviewController.js';
// Import your auth middleware
import { authenticateToken } from '../../shared/auth/authMiddleware.js';

const router = express.Router();

// Customer routes (requires authentication)
router.post('/add', authenticateToken, addCustomerReview);
router.get('/my-reviews', authenticateToken, getCustomerReviews);

export default router;