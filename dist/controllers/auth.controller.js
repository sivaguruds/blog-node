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
exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.viewerBoard = exports.adminBoard = exports.login = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_services_1 = require("../services/auth.services");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield (0, auth_services_1.createUser)(req.body);
        const { message, data, code, status } = newUser.response;
        return res.status(newUser.statusCode).send({ status, message, data });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_GATEWAY).send(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { response, statusCode } = yield (0, auth_services_1.loginUser)(req.body);
        const { message, data, code, status } = response;
        return res.status(statusCode).send({ status, message, data });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_GATEWAY).send(error);
    }
});
exports.login = login;
const adminBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send({
        message: 'Admin Content.',
    });
});
exports.adminBoard = adminBoard;
const viewerBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send({
        message: 'Viewer Content.',
    });
});
exports.viewerBoard = viewerBoard;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { response, statusCode } = yield (0, auth_services_1.refresh)(req.body);
        const { message, data, code, status } = response;
        return res.status(statusCode).send({ status, message, data });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_GATEWAY).send(error);
    }
});
exports.refreshToken = refreshToken;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { statusCode, response } = yield (0, auth_services_1.forgot)(req.body);
        const { message, code, status } = response;
        return res.status(statusCode).send({ status, message });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_GATEWAY).send(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { statusCode, response } = yield (0, auth_services_1.reset)(req.body);
        const { message, code, status } = response;
        return res.status(statusCode).send({ status, message });
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_GATEWAY).send(error);
    }
});
exports.resetPassword = resetPassword;
