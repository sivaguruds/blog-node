"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.forgot = exports.refresh = exports.loginUser = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = __importDefault(require("lodash"));
const refresh_token_1 = __importDefault(require("../database/models/refresh_token"));
const user_1 = __importDefault(require("../database/models/user"));
const user_token_1 = __importDefault(require("../database/models/user_token"));
const genToken_1 = require("../helpers/genToken");
const isEmailExists_1 = require("../helpers/isEmailExists");
const logger_1 = require("../helpers/logger");
const passwordSalt_1 = require("../helpers/passwordSalt");
const responseHandler_1 = __importDefault(require("../helpers/responseHandler"));
const email_1 = require("../utils/email");
/**
 * Create a new user with the given request body.
 *
 * @param {userEntity} reqBody - The request body containing user details.
 * @returns {Promise<object>} - A promise that resolves to the created user.
 * @throws {Error} - If an error occurs during the creation process.
 */
const createUser = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, mobile, email, password, status, role } = reqBody;
        // Check if the email already exists
        if (yield (0, isEmailExists_1.isEmailExists)(email)) {
            return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Email already taken');
        }
        // Hash the user's password
        const hashedPassword = yield (0, passwordSalt_1.passwordHash)(password);
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
        let createdUser = yield user_1.default.create(userObject);
        // Remove the password from the created user object
        const cleanUser = lodash_1.default.omit(createdUser.get(), ['password']);
        // Check if the user was not created successfully
        if (!createdUser) {
            return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Registration Failed! Please try again.');
        }
        // Create user send email function
        (0, email_1.RegisterSucessEmail)(cleanUser.email, cleanUser.firstName);
        // Return the success response with the created user object
        return responseHandler_1.default.returnSuccess(http_status_1.default.OK, 'Successfully Registered the account!', cleanUser);
    }
    catch (error) {
        // Return the error response if any error occurs
        return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Something went wrong!');
    }
});
exports.createUser = createUser;
/**
 * Log in a user with the given email and password.
 * @param {Object} reqBody - The request body containing the user's email and password.
 * @returns {Object} The response object.
 */
const loginUser = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = reqBody;
        // Find the user with the given email
        let userFind = yield user_1.default.findOne({ where: { email } });
        if (!userFind) {
            return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Invalid Email or Password');
        }
        // Check if the password matches
        const isPasswordMatch = yield (0, passwordSalt_1.comparePassword)(password, userFind.password);
        if (!isPasswordMatch) {
            return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Invalid password');
        }
        // Generate a token for the user
        const token = yield (0, genToken_1.genToken)(userFind);
        const cleanUser = lodash_1.default.omit(userFind.get(), ['password']);
        let refreshToken = yield refresh_token_1.default.createToken(cleanUser);
        logger_1.logger.info(refreshToken);
        // Return the response with the user details and access token
        return responseHandler_1.default.returnSuccess(http_status_1.default.OK, 'Login Successful', Object.assign(Object.assign({}, cleanUser), { accessToken: token, refreshToken: refreshToken }));
    }
    catch (error) {
        return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Something went wrong!');
    }
});
exports.loginUser = loginUser;
/**
 * Refreshes the access token using a refresh token.
 *
 * @param reqBody - The request body containing the refresh token.
 * @returns An object containing the new access token and the refresh token.
 */
const refresh = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = reqBody;
    // Check if the refresh token is provided
    if (!refreshToken) {
        return responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'Refresh Token is required!');
    }
    try {
        // Find the refresh token in the database
        const token = yield refresh_token_1.default.findOne({ where: { token: refreshToken } });
        // If the refresh token is not found, return an error
        if (!token) {
            return responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'Invalid refresh token');
        }
        const tokenData = token.toJSON();
        // Verify if the refresh token has expired
        if (refresh_token_1.default.verifyExpiration(tokenData)) {
            // If the refresh token has expired, delete it from the database
            refresh_token_1.default.destroy({ where: { id: tokenData.id } });
            return responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'Refresh token was expired. Please make a new sign in request');
        }
        // Find the user associated with the refresh token
        const userRecord = yield user_1.default.findOne({ where: { id: tokenData.userId } });
        // Generate a new access token
        const newAccessToken = yield (0, genToken_1.genToken)(userRecord);
        // Return the new access token and the refresh token
        return responseHandler_1.default.returnSuccess(http_status_1.default.OK, 'Access Token generated Successful', {
            accessToken: newAccessToken,
            refreshToken: tokenData.token,
        });
    }
    catch (error) {
        return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Something went wrong!');
    }
});
exports.refresh = refresh;
/**
 * Resets the password for a user and sends an email with a password reset link.
 *
 * @param requestBody - The request body containing the user's email.
 * @returns The response indicating the success or failure of the operation.
 */
const forgot = (requestBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = requestBody;
    try {
        // Find the user by their email
        const foundUser = yield user_1.default.findOne({
            where: {
                email,
            },
        });
        if (!foundUser) {
            // Return an error response if the user does not exist
            return responseHandler_1.default.returnError(http_status_1.default.UNPROCESSABLE_ENTITY, 'User does not exist');
        }
        // Delete any existing password reset tokens for the user
        yield user_token_1.default.destroy({ where: { userId: foundUser.id } });
        // Generate a new password reset token
        const newResetToken = yield (0, genToken_1.genToken)(foundUser);
        // Create a new user token record with the generated token
        const userToken = yield user_token_1.default.create({
            userId: foundUser.id,
            token: newResetToken,
        });
        if (userToken) {
            // Create the password reset link
            const link = `http://localhost:3000/passwordReset?token=${newResetToken}&id=${foundUser.id}`;
            // Send the password reset email
            (0, email_1.forgotPasswordEmail)(foundUser.email, foundUser.firstName, link);
            // Return a success response
            return responseHandler_1.default.returnSuccess(http_status_1.default.OK, 'Check your email');
        }
    }
    catch (error) {
        // Return an error response if an error occurs
        return responseHandler_1.default.returnError(http_status_1.default.UNPROCESSABLE_ENTITY, error.message);
    }
});
exports.forgot = forgot;
/**
 * Resets the password for a user.
 *
 * @param requestBody - The request body containing the userId, token, and new password.
 * @returns A response indicating the success or failure of the password reset.
 */
const reset = (requestBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, token, password } = requestBody;
    try {
        // Find the password reset token for the user
        const passwordResetToken = yield user_token_1.default.findOne({ where: { userId } });
        if (!passwordResetToken) {
            // If the password reset token does not exist, return an error
            return responseHandler_1.default.returnError(http_status_1.default.UNPROCESSABLE_ENTITY, 'User does not exist');
        }
        if (token !== passwordResetToken.token) {
            // If the token provided does not match the password reset token, return an error
            return responseHandler_1.default.returnError(http_status_1.default.UNPROCESSABLE_ENTITY, 'Invalid or expired password reset token');
        }
        // Hash the new password
        const hashedPassword = yield (0, passwordSalt_1.passwordHash)(password);
        const value = {
            password: hashedPassword,
        };
        // Update the user's password
        const results = yield user_1.default.update(value, { where: { id: userId } });
        if (results) {
            // If the password is successfully updated, destroy the password reset token
            yield passwordResetToken.destroy();
            return responseHandler_1.default.returnSuccess(http_status_1.default.OK, 'Password Reset Successfully');
        }
    }
    catch (error) {
        // If there's an error, return an error response
        return responseHandler_1.default.returnError(http_status_1.default.UNPROCESSABLE_ENTITY, error.message);
    }
});
exports.reset = reset;
