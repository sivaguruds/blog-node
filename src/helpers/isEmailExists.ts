import user from '../database/models/user';

/**
 * Check if an email exists in the user database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the email exists.
 */
export const isEmailExists = async (email: string): Promise<boolean> => {
  // SELECT * FROM users WHERE email = 'email_address'
  // Find a user with the given email address
  const findEmail = await user.findOne({ where: { email } });

  // Return true if the email exists, false otherwise
  return !!findEmail;
};
