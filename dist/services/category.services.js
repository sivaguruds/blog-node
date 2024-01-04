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
exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const category_1 = __importDefault(require("../database/models/category"));
const responseHandler_1 = __importDefault(require("../helpers/responseHandler"));
/**
 * Create a new category.
 *
 * @param {categories} reqBody - The request body containing the name and description of the category.
 * @returns {Promise<Object>} - A Promise that resolves to the response object.
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = reqBody;
        const createdCategory = yield category_1.default.create({
            name,
            description,
        });
        return responseHandler_1.default.returnSuccess(http_status_1.default.OK, 'Successfully category created!', createdCategory.toJSON());
    }
    catch (error) {
        return responseHandler_1.default.returnError(http_status_1.default.BAD_REQUEST, 'Something went wrong!');
    }
});
exports.create = create;
