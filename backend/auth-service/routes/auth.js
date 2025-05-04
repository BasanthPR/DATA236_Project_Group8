import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../../shared/auth/authMiddleware.js';

const router = express.Router();

// Explicit role injection
router.post('/signup/customer', (req, res, next) => {
  req.body.role = 'customer';
  signup(req, res, next);
});

router.post('/signup/driver', (req, res, next) => {
  req.body.role = 'driver';
  signup(req, res, next);
});

// Shared routes
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

export default router;
