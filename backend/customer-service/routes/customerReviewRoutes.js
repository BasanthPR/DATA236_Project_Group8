import express from 'express';
import { addCustomerReview, getCustomerReviews } from '../controllers/customerReviewController.js';
import { authMiddleware } from '../controllers/profileController.js';

const router = express.Router();

router.post('/add', authMiddleware, addCustomerReview);
router.get('/my-reviews', authMiddleware, getCustomerReviews);

export default router;
