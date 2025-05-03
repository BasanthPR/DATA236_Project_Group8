import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password with bcrypt.
 * @param {string} password - Plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password) => {
  const saltRounds = 12;  // Can make this configurable via env later.
  return await bcrypt.hash(password, saltRounds);
};
