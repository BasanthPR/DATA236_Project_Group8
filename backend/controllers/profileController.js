import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// JWT Auth Middleware
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile', error: err.message });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      customerId,
      creditCard
    } = req.body;

    const updatedFields = {
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      customerId,
      creditCard
    };

    const updatedUser = await User.findByIdAndUpdate(req.userId, updatedFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};
