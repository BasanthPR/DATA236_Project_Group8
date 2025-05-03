import express from 'express';
import * as rideController from '../controllers/rideController.js';
import { validateRideRequest } from '../middleware/validators.js';
import {
  authenticateToken,
  authorizeRoles
} from '../../shared/auth/authMiddleware.js';

const router = express.Router();

// 1. Create a new ride request (only customers)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('customer', 'admin'),
  validateRideRequest,
  rideController.createRideRequest
);

// 2. Edit ride details (customer or admin)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('customer', 'admin'),
  rideController.updateRideDetails
);

// 3. Cancel/delete a ride (only customer)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('customer'),
  rideController.cancelOrDeleteRide
);

// 4. Get all rides by a customer (only customer or admin)
router.get(
  '/customer/:customerId',
  authenticateToken,
  authorizeRoles('customer', 'admin'),
  rideController.getUserRides
);

// 5. Get all rides by a driver (only driver)
router.get(
  '/driver/:driverId',
  authenticateToken,
  authorizeRoles('driver', 'admin'),
  rideController.getDriverRides
);

// 6. Get ride statistics by pickup location (admin only)
router.get(
  '/stats/location',
  authenticateToken,
  authorizeRoles('admin'),
  rideController.getStatsByLocation
);

// 7. Get nearby drivers (admin or customer access)
router.get(
  '/nearby-drivers',
  authenticateToken,
  authorizeRoles('admin', 'customer'),
  rideController.getNearbyDrivers
);

export default router;
