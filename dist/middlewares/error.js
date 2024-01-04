"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorConverter = exports.errorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../helpers/logger");
const ApiError_1 = __importDefault(require("../helpers/ApiError"));
dotenv_1.default.config();
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res) => {
    let { statusCode, message } = err;
    console.log('errorHandler', err);
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = http_status_1.default[http_status_1.default.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ code: statusCode, message }, (process.env.NODE_ENV === 'development' && { stack: err.stack }));
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.error(err);
    }
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.default)) {
        const statusCode = error.statusCode ? http_status_1.default.BAD_REQUEST : http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_1.default[statusCode];
        error = new ApiError_1.default(statusCode, message, false, err.stack);
    }
    (0, exports.errorHandler)(error, req, res);
    next(error);
};
exports.errorConverter = errorConverter;
