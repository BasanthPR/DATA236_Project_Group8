import bcrypt from 'bcryptjs';

/**
 * Compare a plain text password with a hashed password.
 * @param {string} plainText - The plain text password.
 * @param {string} hashed - The hashed password from the DB.
 * @returns {Promise<boolean>} - True if match, false otherwise.
 */
export const comparePasswords = async (plainText, hashed) => {
  return await bcrypt.compare(plainText, hashed);
};
