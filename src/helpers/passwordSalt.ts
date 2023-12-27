import bcrypt from 'bcrypt';

/**
 * Hashes the given password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @return {Promise<string>} - A promise that resolves to the hashed password.
 */
export const passwordHash = async (password: string): Promise<string> => {
  // Generate a salt using bcrypt with a factor of 10
  const salt = await bcrypt.genSalt(10);
  // Hash the password using the generated salt
  const hash = await bcrypt.hash(password, salt);
  // Return the hashed password
  return hash;
};
