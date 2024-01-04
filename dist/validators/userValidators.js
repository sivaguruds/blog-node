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
exports.userLoginValidator = exports.userCreateValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../helpers/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
/**
 * Validates the request body for creating a user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
const userCreateValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        mobile: joi_1.default.string()
            .length(10)
            .pattern(/^[0-9]+$/)
            .required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string()
            .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/, 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')
            .required(),
        role: joi_1.default.string().valid('admin', 'viewer').required(),
        status: joi_1.default.boolean().valid(true).required(),
    });
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        next(new ApiError_1.default(http_status_1.default.BAD_REQUEST, errorMessage));
    }
    else {
        req.body = value;
        return next();
    }
});
exports.userCreateValidator = userCreateValidator;
/**
 * Validates the user login request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {void}
 */
const userLoginValidator = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string()
            .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/, 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')
            .required(),
    });
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        next(new ApiError_1.default(http_status_1.default.BAD_REQUEST, errorMessage));
    }
    else {
        req.body = value;
        next();
    }
};
exports.userLoginValidator = userLoginValidator;
