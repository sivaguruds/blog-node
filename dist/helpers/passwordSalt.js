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
exports.comparePassword = exports.passwordHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hashes the given password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @return {Promise<string>} - A promise that resolves to the hashed password.
 */
const passwordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a salt using bcrypt with a factor of 10
    const salt = yield bcrypt_1.default.genSalt(10);
    // Hash the password using the generated salt
    const hash = yield bcrypt_1.default.hash(password, salt);
    // Return the hashed password
    return hash;
});
exports.passwordHash = passwordHash;
/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
const comparePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    // Use bcrypt to compare the plain text password with the hashed password.
    return yield bcrypt_1.default.compareSync(password, hash);
});
exports.comparePassword = comparePassword;
