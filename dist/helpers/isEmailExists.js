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
exports.isEmailExists = void 0;
const user_1 = __importDefault(require("../database/models/user"));
/**
 * Check if an email exists in the user database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the email exists.
 */
const isEmailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // SELECT * FROM users WHERE email = 'email_address'
    // Find a user with the given email address
    const findEmail = yield user_1.default.findOne({ where: { email } });
    // Return true if the email exists, false otherwise
    return !!findEmail;
});
exports.isEmailExists = isEmailExists;
