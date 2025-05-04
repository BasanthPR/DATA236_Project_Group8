// import { verifyToken } from '../../shared/auth/index.js';

// /**
//  * Middleware to authenticate JWT token from Authorization header.
//  */
// export const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1]; // Expecting: Bearer TOKEN

//   if (!token) {
//     return res.status(401).json({ message: "Access token missing" });
//   }

//   try {
//     const decoded = verifyToken(token);  // ✅ Use shared helper
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error("❌ JWT verification failed:", err.message);
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// /**
//  * Middleware for role-based authorization.
//  * @param  {...string} allowedRoles - Roles allowed to access the route.
//  */
// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user || !req.user.role) {
//       return res.status(403).json({ message: "No user role found: access denied" });
//     }
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: "You are not authorized for this action" });
//     }
//     next();
//   };
// };
