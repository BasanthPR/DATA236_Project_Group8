// routes/customerReviewRoutes.js
import express from 'express';
import {
  addReview,
  getReviews,
  updateReview,
  deleteReview
} from '../controllers/customerReviewController.js';
import { authenticateToken, authorizeRoles } from '../../shared/auth/index.js';

const router = express.Router();

// All require login
router.use(authenticateToken);

// POST   /api/customer/reviews      (customer only)
router.post(
  '/',
  authorizeRoles('customer'),
  addReview
);

// GET    /api/customer/reviews      (customer or admin)
router.get(
  '/',
  authorizeRoles('customer','admin'),
  getReviews
);

// PUT    /api/customer/reviews/:id  (owner or admin)
router.put(
  '/:id',
  authorizeRoles('customer','admin'),
  updateReview
);

// DELETE /api/customer/reviews/:id  (owner or admin)
router.delete(
  '/:id',
  authorizeRoles('customer','admin'),
  deleteReview
);

export default router;
