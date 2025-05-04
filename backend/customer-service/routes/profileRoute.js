// routes/customerRoutes.js
import express from 'express';
import { updateCustomerProfile } from '../controllers/customerController.js';
import { authenticateToken, authorizeRoles } from '../../shared/auth/index.js';

const router = express.Router();

// PATCH /api/customers/profile
// — Update only (customer role, JWT-protected)
router.patch(
  '/profile',
  authenticateToken,
  authorizeRoles('customer'),
  updateCustomerProfile
);

export default router;
