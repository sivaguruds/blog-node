import httpStatus from 'http-status';
import _ from 'lodash';
import user from '../database/models/user';
import { isEmailExists } from '../helpers/isEmailExists';
import { logger } from '../helpers/logger';
import { passwordHash } from '../helpers/passwordSalt';
import responseHandler from '../helpers/responseHandler';
import { userEntity } from '../types/user';

/**
 * Create a new user with the given request body.
 *
 * @param {userEntity} reqBody - The request body containing user details.
 * @returns {Promise<object>} - A promise that resolves to the created user.
 * @throws {Error} - If an error occurs during the creation process.
 */
export const createUser = async (reqBody: userEntity) => {
  try {
    const { firstName, lastName, mobile, email, password, status, role } = reqBody;

    // Check if the email already exists
    if (await isEmailExists(email)) {
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    // Hash the user's password
    const hashedPassword = await passwordHash(password);

    // Create a new user object
    const userObject = {
      firstName,
      lastName,
      mobile,
      email,
      password: hashedPassword,
      status,
      role,
    };

    // Create the user in the database
    const createdUser = await user.create(userObject);

    // Remove the password from the created user object
    const cleanUser = _.omit(createdUser, 'password');

    // Check if the user was not created successfully
    if (!createdUser) {
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Registration Failed! Please try again.');
    }

    // Return the success response with the created user object
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Registered the account!', cleanUser);
  } catch (error) {
    // Return the error response if any error occurs
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
