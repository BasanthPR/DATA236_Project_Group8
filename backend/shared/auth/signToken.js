import jwt from 'jsonwebtoken';

/**
 * Sign a JWT token.
 * @param {object} payload - Data to include in the token (e.g., { id, role, email }).
 * @param {string} [expiresIn='1d'] - Expiration time (default 1 day).
 * @returns {string} - The signed JWT token.
 */
export const signToken = (payload, expiresIn = '1d') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};
