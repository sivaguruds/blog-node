import httpStatus from 'http-status';
import _ from 'lodash';
import refresh_token from '../database/models/refresh_token';
import user from '../database/models/user';
import user_token from '../database/models/user_token';
import { genToken } from '../helpers/genToken';
import { isEmailExists } from '../helpers/isEmailExists';
import { logger } from '../helpers/logger';
import { comparePassword, passwordHash } from '../helpers/passwordSalt';
import responseHandler from '../helpers/responseHandler';
import { Token, userEntity, userLoginEntity } from '../types/user';
import { forgotPasswordEmail, RegisterSucessEmail } from '../utils/email';

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

/**
 * Refreshes the access token using a refresh token.
 *
 * @param reqBody - The request body containing the refresh token.
 * @returns An object containing the new access token and the refresh token.
 */
export const refresh = async (reqBody: { refreshToken: string }) => {
  const { refreshToken } = reqBody;

  // Check if the refresh token is provided
  if (!refreshToken) {
    return responseHandler.returnError(httpStatus.FORBIDDEN, 'Refresh Token is required!');
  }

  try {
    // Find the refresh token in the database
    const token = await refresh_token.findOne({ where: { token: refreshToken } });

    // If the refresh token is not found, return an error
    if (!token) {
      return responseHandler.returnError(httpStatus.FORBIDDEN, 'Invalid refresh token');
    }

    const tokenData = token.toJSON();

    // Verify if the refresh token has expired
    if (refresh_token.verifyExpiration(tokenData)) {
      // If the refresh token has expired, delete it from the database
      refresh_token.destroy({ where: { id: tokenData.id } });
      return responseHandler.returnError(httpStatus.FORBIDDEN, 'Refresh token was expired. Please make a new sign in request');
    }

    // Find the user associated with the refresh token
    const userRecord: any = await user.findOne({ where: { id: tokenData.userId } });

    // Generate a new access token
    const newAccessToken = await genToken(userRecord);

    // Return the new access token and the refresh token
    return responseHandler.returnSuccess(httpStatus.OK, 'Access Token generated Successful', {
      accessToken: newAccessToken,
      refreshToken: tokenData.token,
    });
  } catch (error) {
    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

/**
 * Resets the password for a user and sends an email with a password reset link.
 *
 * @param requestBody - The request body containing the user's email.
 * @returns The response indicating the success or failure of the operation.
 */
export const forgot = async (requestBody: { email: string }) => {
  const { email } = requestBody;

  try {
    // Find the user by their email
    const foundUser: any = await user.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      // Return an error response if the user does not exist
      return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, 'User does not exist');
    }

    // Delete any existing password reset tokens for the user
    await user_token.destroy({ where: { userId: foundUser.id } });

    // Generate a new password reset token
    const newResetToken = await genToken(foundUser);

    // Create a new user token record with the generated token
    const userToken = await user_token.create({
      userId: foundUser.id,
      token: newResetToken,
    });

    if (userToken) {
      // Create the password reset link
      const link = `http://localhost:3000/passwordReset?token=${newResetToken}&id=${foundUser.id}`;

      // Send the password reset email
      forgotPasswordEmail(foundUser.email, foundUser.firstName, link);

      // Return a success response
      return responseHandler.returnSuccess(httpStatus.OK, 'Check your email');
    }
  } catch (error: any) {
    // Return an error response if an error occurs
    return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
  }
};

/**
 * Resets the password for a user.
 *
 * @param requestBody - The request body containing the userId, token, and new password.
 * @returns A response indicating the success or failure of the password reset.
 */
export const reset = async (requestBody: { userId: string; token: string; password: string }) => {
  const { userId, token, password } = requestBody;

  try {
    // Find the password reset token for the user
    const passwordResetToken = await user_token.findOne({ where: { userId } });

    if (!passwordResetToken) {
      // If the password reset token does not exist, return an error
      return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, 'User does not exist');
    }

    if (token !== passwordResetToken.token) {
      // If the token provided does not match the password reset token, return an error
      return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid or expired password reset token');
    }

    // Hash the new password
    const hashedPassword = await passwordHash(password);
    const value = {
      password: hashedPassword,
    };

    // Update the user's password
    const results = await user.update(value, { where: { id: userId } });

    if (results) {
      // If the password is successfully updated, destroy the password reset token
      await passwordResetToken.destroy();
      return responseHandler.returnSuccess(httpStatus.OK, 'Password Reset Successfully');
    }
  } catch (error: any) {
    // If there's an error, return an error response
    return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
  }
};
