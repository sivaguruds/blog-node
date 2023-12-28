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

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  // Use bcrypt to compare the plain text password with the hashed password.
  return await bcrypt.compareSync(password, hash);
};
