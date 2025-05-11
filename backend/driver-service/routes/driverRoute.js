// routes/driverRoute.js
import express from 'express'
import multer from 'multer'
import { storage } from '../../shared/cloudinary/cloudinary.js'
import {
  createDriver,
  getDriverProfile,
  getNearbyDrivers,
  updateDriverLocation,
  updateDriverMedia,
  updateDriverProfile
} from '../controllers/driverController.js'
import {
  addDriverReview,
  getDriverReviews
} from '../controllers/driverReview.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { 
  createDriverRules, 
  getNearbyDriversRules, 
  validate,
  updateLocationRules,
  reviewRules 
} from '../middleware/validators.js';

const router = express.Router()
const upload = multer({ storage })

// All routes under here require a valid JWT
router.use(authenticateToken)

/**
 * Profile CRUD
 */
router
  .route('/profile')
  .get(getDriverProfile)                                 // GET  /api/drivers/profile
  .post(
    createDriverRules,
    validate,
    createDriver)                                    // POST /api/drivers/profile
  .patch(
    upload.fields([{ name: 'image' }, { name: 'video' }]),
    validate,
    updateDriverProfile                                  // PATCH /api/drivers/profile
  )

/**
 * Media only
 */
router.patch(
  '/media',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  validate,
  updateDriverMedia                                      // PATCH /api/drivers/media
)

/**
 * Location only
 */
router.patch(
  '/location',
  updateLocationRules,
  validate,
  updateDriverLocation                                   // PATCH /api/drivers/location
)

/**
 * Nearby lookup
 */
router.get(
  '/nearby', 
  getNearbyDriversRules,
  validate,
  getNearbyDrivers                                       // GET  /api/drivers/nearby
)

/**
 * Driver → Customer Reviews
 *  POST /api/drivers/reviews  → create/update a review this driver writes about a customer
 *  GET  /api/drivers/reviews  → list all reviews this driver has submitted
 */
router
  .route('/reviews')
  .post(reviewRules, validate, addDriverReview)
  .get(getDriverReviews)

export default router
