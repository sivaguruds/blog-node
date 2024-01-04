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
exports.categoryCreateValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../helpers/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const categoryCreateValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
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
exports.categoryCreateValidator = categoryCreateValidator;
