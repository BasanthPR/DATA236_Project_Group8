// routes/driverReviewRoute.js
import express from 'express'
import {
  addDriverReview,
  getDriverReviews
} from '../controllers/driverReview.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes under here require a valid JWT
router.use(authenticateToken)

/**
 * POST   /api/driver/reviews   → add or update a review a driver gives to a customer
 * GET    /api/driver/reviews   → list all reviews this driver has submitted
 */
router
  .route('/reviews')
  .post(addDriverReview)
  .get(getDriverReviews)

export default router
