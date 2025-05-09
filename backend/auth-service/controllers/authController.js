// import User from '../models/user.js';
// import {
//   hashPassword,
//   comparePasswords,
//   signToken
// } from '../../shared/auth/index.js';
// import redisClient from '../../shared/redis/redisClient.js';


// // Allowed roles that can sign up through public API
// const ALLOWED_SIGNUP_ROLES = ['customer', 'driver'];

// // Signup
// const signup = async (req, res) => {
//   const { firstName, lastName, email, password, role } = req.body;

//   // Validate role
//   if (!ALLOWED_SIGNUP_ROLES.includes(role)) {
//     return res.status(403).json({ message: 'Invalid or unauthorized role' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await hashPassword(password);

//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       role
//     });

//     // const token = signToken(
//     //   { id: newUser._id, role: newUser.role, email: newUser.email},
//     //   process.env.JWT_EXPIRES_IN || '1d'
//     // );
//     const token = signToken(
//   { 
//     id: user._id,
//     role: user.role,
//     email: user.email,
//     firstName: user.firstName,
//     lastName: user.lastName
//   },
//   process.env.JWT_EXPIRES_IN || '1d'
// );

//     res.status(201).json({
//       user: {
//         id: newUser._id,
//         firstName: newUser.firstName,
//         lastName: newUser.lastName,
//         email: newUser.email,
//         role: newUser.role
//       },
//       token
//     });
//   } catch (err) {
//     console.error('❌ Signup error:', err.message);
//     res.status(500).json({ message: 'Signup failed', error: err.message });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   let fromCache = false;
//   let safeUser;

//   // 1) Try Redis
//   const cached = await redisClient.get(`user:${email}`);
//   if (cached) {
//     safeUser = JSON.parse(cached);
//     fromCache = true;
//     console.log(`✅ Cache hit for ${email}`);
//   } else {
//     // 2) Fallback to DB
//     console.log(`❌ Cache miss for ${email}, querying database...`);
//     const userDoc = await User.findOne({ email });
//     if (!userDoc) {
//       console.log(`❌ User not found in database for ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // strip password
//     const { password: pw, ...rest } = userDoc.toObject();
//     safeUser = rest;
//     console.log(`✅ User found in database for ${email}, caching result...`);
//     await redisClient.setEx(`user:${email}`, 3600, JSON.stringify(rest));
//   }

//   // 3) Always fetch hashed password from DB to compare
//   console.log(`🔒 Fetching hashed password from database for ${email} to compare...`);
//   const userRecord = await User.findOne({ email });
//   const isMatch = await comparePasswords(password, userRecord.password);
//   if (!isMatch) {
//     console.log(`❌ Invalid credentials for ${email}`);
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   // 4) Issue JWT
//   console.log(`✅ Credentials valid for ${email}, issuing JWT...`);
//   // const token = signToken(
//   //   { id: userRecord._id, role: userRecord.role, email: userRecord.email },
//   //   process.env.JWT_EXPIRES_IN || '1d'
//   // );
//   const token = signToken(
//     { 
//       id: user._id,
//       role: user.role,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName
//     },
//     process.env.JWT_EXPIRES_IN || '1d'
//   );

//   // 5) Optional header
//   res.setHeader('X-Data-Source', fromCache ? 'cache' : 'db');
//   console.log(`📤 Response for ${email} will include data source: ${fromCache ? 'cache' : 'db'}`);

//   // 6) The exact JSON shape you asked for:
//   return res.status(200).json({
//     user: {
//       id: userRecord._id,
//       firstName: userRecord.firstName,
//       lastName: userRecord.lastName,
//       email: userRecord.email,
//       role: userRecord.role
//     },
//     token,
//     source: fromCache ? 'cache' : 'db' // drop this line if you don’t need it
//   });
// };


// // Get Profile
// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('firstName lastName email role');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json(user);
//   } catch (err) {
//     console.error('❌ Profile fetch error:', err.message);
//     res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
//   }
// };

// export { signup, login, getProfile };

import User from '../models/user.js';
import {
  hashPassword,
  comparePasswords,
  signToken
} from '../../shared/auth/index.js';
import redisClient from '../../shared/redis/redisClient.js';


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

    // Create token with all user information needed by customer service
    const token = signToken(
      { 
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
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

const login = async (req, res) => {
  const { email, password } = req.body;
  let fromCache = false;
  let safeUser;

  // 1) Try Redis
  const cached = await redisClient.get(`user:${email}`);
  if (cached) {
    safeUser = JSON.parse(cached);
    fromCache = true;
    console.log(`✅ Cache hit for ${email}`);
  } else {
    // 2) Fallback to DB
    console.log(`❌ Cache miss for ${email}, querying database...`);
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      console.log(`❌ User not found in database for ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }
    // strip password
    const { password: pw, ...rest } = userDoc.toObject();
    safeUser = rest;
    console.log(`✅ User found in database for ${email}, caching result...`);
    await redisClient.setEx(`user:${email}`, 3600, JSON.stringify(rest));
  }

  // 3) Always fetch hashed password from DB to compare
  console.log(`🔒 Fetching hashed password from database for ${email} to compare...`);
  const userRecord = await User.findOne({ email });
  const isMatch = await comparePasswords(password, userRecord.password);
  if (!isMatch) {
    console.log(`❌ Invalid credentials for ${email}`);
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // 4) Issue JWT with complete user info
  console.log(`✅ Credentials valid for ${email}, issuing JWT...`);
  const token = signToken(
    { 
      id: userRecord._id,
      role: userRecord.role,
      email: userRecord.email,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName
    },
    process.env.JWT_EXPIRES_IN || '1d'
  );

  // 5) Optional header
  res.setHeader('X-Data-Source', fromCache ? 'cache' : 'db');
  console.log(`📤 Response for ${email} will include data source: ${fromCache ? 'cache' : 'db'}`);

  // 6) The exact JSON shape you asked for:
  return res.status(200).json({
    user: {
      id: userRecord._id,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      email: userRecord.email,
      role: userRecord.role
    },
    token,
    source: fromCache ? 'cache' : 'db' // drop this line if you don't need it
  });
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
