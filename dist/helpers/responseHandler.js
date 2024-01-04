"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a success response object.
 *
 * @param statusCode - The status code of the response.
 * @param message - The message of the response.
 * @param data - Optional data to include in the response.
 * @returns The success response object.
 */
const returnSuccess = (statusCode, message, data) => {
    const response = {
        statusCode,
        response: {
            status: true,
            code: statusCode,
            message,
            data,
        },
    };
    return response;
};
/**
 * Returns an error response object with the specified status code and message.
 * @param statusCode - The status code of the error response.
 * @param message - The message of the error response.
 * @returns The error response object.
 */
const returnError = (statusCode, message) => {
    /**
     * The error response object.
     */
    const response = {
        statusCode,
        response: {
            status: false,
            code: statusCode,
            message,
        },
    };
    return response;
};
exports.default = { returnSuccess, returnError };
