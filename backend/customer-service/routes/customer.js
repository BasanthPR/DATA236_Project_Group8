// routes/customer.js
import express from 'express';
import {
  createCustomer,
  getCustomer,
  updateCustomer
} from '../controllers/customerController.js';
import {
  authenticateToken,
  authorizeRoles
} from '../../shared/auth/authMiddleware.js';

const router = express.Router();

// All routes require a valid JWT and customer role
router.post('/', authenticateToken, authorizeRoles('customer'), createCustomer);
router.get('/', authenticateToken, authorizeRoles('customer'), getCustomer);
router.put('/', authenticateToken, authorizeRoles('customer'), updateCustomer);

export default router;
