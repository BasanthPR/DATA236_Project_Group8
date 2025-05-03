import User from '../models/user.js'; // Ensure this path is correct from admin-service
import {
  hashPassword,
  comparePasswords,
  signToken
} from '../../shared/auth/index.js'; // ✅ All helpers from shared module

// Admin Signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();

    // Generate token
    const token = signToken({
      id: newAdmin._id,
      role: newAdmin.role,
      email: newAdmin.email
    }, '1h');

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: `${newAdmin.firstName} ${newAdmin.lastName}`
      }
    });
  } catch (err) {
    console.error("❌ Admin signup error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Admin Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: not an admin" });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email
    }, '1h');

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export { signup, login };