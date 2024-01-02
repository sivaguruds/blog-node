import httpStatus from 'http-status';
import _ from 'lodash';
import refresh_token from '../database/models/refresh_token';
import user from '../database/models/user';
import { genToken } from '../helpers/genToken';
import { isEmailExists } from '../helpers/isEmailExists';
import { logger } from '../helpers/logger';
import { comparePassword, passwordHash } from '../helpers/passwordSalt';
import responseHandler from '../helpers/responseHandler';
import { userEntity, userLoginEntity } from '../types/user';
import { RegisterSucessEmail } from '../utils/email';

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
    let createdUser = await user.create(userObject);

    // Remove the password from the created user object
    const cleanUser = _.omit(createdUser.get(), ['password']);

    // Check if the user was not created successfully
    if (!createdUser) {
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Registration Failed! Please try again.');
    }

    // Create user send email function
    RegisterSucessEmail(cleanUser.email, cleanUser.firstName);

    // Return the success response with the created user object
    return responseHandler.returnSuccess(httpStatus.OK, 'Successfully Registered the account!', cleanUser);
  } catch (error) {
    // Return the error response if any error occurs
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Log in a user with the given email and password.
 * @param {Object} reqBody - The request body containing the user's email and password.
 * @returns {Object} The response object.
 */
export const loginUser = async (reqBody: userLoginEntity) => {
  try {
    const { email, password } = reqBody;

    // Find the user with the given email
    let userFind: any = await user.findOne({ where: { email } });
    if (!userFind) {
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid Email or Password');
    }

    // Check if the password matches
    const isPasswordMatch = await comparePassword(password, userFind.password);
    if (!isPasswordMatch) {
      return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid password');
    }

    // Generate a token for the user
    const token = await genToken(userFind);
    const cleanUser = _.omit(userFind.get(), ['password']);

    let refreshToken = await refresh_token.createToken(cleanUser);
    logger.info(refreshToken);

    // Return the response with the user details and access token
    return responseHandler.returnSuccess(httpStatus.OK, 'Login Successful', {
      ...cleanUser,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

export const refresh = async (reqBody: any) => {
  const { refreshToken } = reqBody;

  if (!refreshToken) {
    return responseHandler.returnError(httpStatus.FORBIDDEN, 'Refresh Token is required!');
  }

  try {
    const token = await refresh_token.findOne({ where: { token: refreshToken } });

    if (!token) {
      return responseHandler.returnError(httpStatus.FORBIDDEN, 'Invalid refresh token');
    }

    if (refresh_token.verifyExpiration(token.toJSON())) {
      refresh_token.destroy({ where: { id: token.toJSON().id } });
      return responseHandler.returnError(httpStatus.FORBIDDEN, 'Refresh token was expired. Please make a new sign in request');
    }

    const userRecord: any = await user.findOne({ where: { id: token.toJSON().userId } });
    const newAccessToken = await genToken(userRecord);

    return responseHandler.returnSuccess(httpStatus.OK, 'Access Token generated Successful', {
      accessToken: newAccessToken,
      refreshToken: token.toJSON().token,
    });
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
