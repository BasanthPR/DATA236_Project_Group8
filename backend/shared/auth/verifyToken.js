import jwt from 'jsonwebtoken';

/**
 * Verify a JWT token.
 * @param {string} token - The JWT token.
 * @returns {Promise<object>} - The decoded payload.
 * @throws Will throw an error if invalid/expired.
 */
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};
