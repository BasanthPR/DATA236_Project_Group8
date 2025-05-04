import User from '../models/user.js';
import {
  hashPassword,
  comparePasswords,
  signToken
} from '../../shared/auth/index.js';

// Allowed roles that can sign up through public API
const ALLOWED_SIGNUP_ROLES = ['customer', 'driver'];

// Signup
const signup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Validate role
  if (!ALLOWED_SIGNUP_ROLES.includes(role)) {
    return res.status(403).json({ message: 'Invalid or unauthorized role' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    const token = signToken(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_EXPIRES_IN || '1d'
    );

    res.status(201).json({
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(
      { id: user._id, role: user.role },
      process.env.JWT_EXPIRES_IN || '1d'
    );

    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('firstName lastName email role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Profile fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

export { signup, login, getProfile };
