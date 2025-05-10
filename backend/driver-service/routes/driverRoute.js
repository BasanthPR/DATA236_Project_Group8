// routes/driverRoute.js
import express from "express";
import multer from 'multer';
import { storage } from '../../shared/cloudinary/cloudinary.js';
import { 
  createDriver,
  getDriverProfile,
  getNearbyDrivers,
  updateDriverLocation,
  updateDriverMedia,
  updateDriverProfile      // ← import the new handler
} from "../controllers/driverController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";


const router = express.Router();
const upload = multer({ storage });

// Apply authentication to all routes
router.use(authenticateToken);

// Create profile (with optional image+video upload)
router
  .route('/profile')
  .get(authenticateToken, getDriverProfile)
  .post(authenticateToken, createDriver)                              // createDriver handles POST
  .patch(
    authenticateToken,
    upload.fields([{ name: 'image' }, { name: 'video' }]),  // multer to parse your FormData
    updateDriverProfile
  )


// Get own profile
router.get('/profile', getDriverProfile);

// Update only image/video after profile exists
router.patch(
  '/media',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  updateDriverMedia
);

// Get nearby drivers
router.get('/nearby', getNearbyDrivers);

// Update geo-location
router.patch('/location', updateDriverLocation);

export default router;
