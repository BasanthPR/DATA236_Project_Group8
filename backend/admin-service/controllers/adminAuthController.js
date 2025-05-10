import User from '../models/user.js'; // Ensure this path is correct from admin-service
import {
  hashPassword,
  comparePasswords,
  signToken
} from '../../shared/auth/index.js'; // ✅ All helpers from shared module
import redisClient from '../../shared/redis/redisClient.js'; // Import Redis client

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
    let fromCache = false;
    let safeUser;

    // 1) Try Redis
    const cached = await redisClient.get(`admin:${email}`);
    if (cached) {
      safeUser = JSON.parse(cached);
      fromCache = true;
      console.log(`✅ Cache hit for admin: ${email}`);
    } else {
      // 2) Fallback to DB
      console.log(`❌ Cache miss for admin: ${email}, querying database...`);
      const userDoc = await User.findOne({ email });
      if (!userDoc || userDoc.role !== "admin") {
        console.log(`❌ Admin not found in database for ${email}`);
        return res.status(403).json({ message: "Access denied: not an admin" });
      }

      // Strip password before caching
      const { password: pw, ...rest } = userDoc.toObject();
      safeUser = rest;
      console.log(`✅ Admin found in database for ${email}, caching result...`);
      await redisClient.setEx(`admin:${email}`, 3600, JSON.stringify(rest)); // Cache for 1 hour
    }

    // 3) Always fetch hashed password from DB to compare
    console.log(`🔒 Fetching hashed password from database for admin: ${email} to compare...`);
    const userRecord = await User.findOne({ email });
    const isMatch = await comparePasswords(password, userRecord.password);
    if (!isMatch) {
      console.log(`❌ Invalid credentials for admin: ${email}`);
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // 4) Issue JWT
    console.log(`✅ Credentials valid for admin: ${email}, issuing JWT...`);
    const token = signToken({
      id: userRecord._id,
      role: userRecord.role,
      email: userRecord.email
    }, '1h');

    // 5) Optional header
    res.setHeader('X-Data-Source', fromCache ? 'cache' : 'db');
    console.log(`📤 Response for admin: ${email} will include data source: ${fromCache ? 'cache' : 'db'}`);

    // 6) Return response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userRecord._id,
        email: userRecord.email,
        name: `${userRecord.firstName} ${userRecord.lastName}`
      },
      source: fromCache ? 'cache' : 'db' // Optional: Include source for debugging
    });
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export { signup, login };