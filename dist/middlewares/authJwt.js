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
exports.isUser = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_1 = __importDefault(require("http-status"));
const responseHandler_1 = __importDefault(require("../helpers/responseHandler"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the JWT from the request header.
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(http_status_1.default.BAD_REQUEST).send(responseHandler_1.default.returnError(http_status_1.default.UNAUTHORIZED, 'No token provided!'));
    }
    const configJwtKey = process.env.JWTSECRETKEY;
    jsonwebtoken_1.default.verify(token === null || token === void 0 ? void 0 : token.split(' ')[1], configJwtKey, (err, decoded) => {
        if (err) {
            return res
                .status(http_status_1.default.UNAUTHORIZED)
                .send(responseHandler_1.default.returnError(http_status_1.default.UNAUTHORIZED, 'Unauthorized! Access Token was expired!'));
        }
        next();
    });
});
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(http_status_1.default.FORBIDDEN).send(responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'No token provided!'));
    }
    const configJwtKey = process.env.JWTSECRETKEY;
    jsonwebtoken_1.default.verify(token === null || token === void 0 ? void 0 : token.split(' ')[1], configJwtKey, (err, decoded) => {
        if (err) {
            return res.status(http_status_1.default.UNAUTHORIZED).send(responseHandler_1.default.returnError(http_status_1.default.UNAUTHORIZED, 'Unauthorized'));
        }
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) === 'admin') {
            next();
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).send(responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'Require Admin Role!'));
        }
    });
});
exports.isAdmin = isAdmin;
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(http_status_1.default.FORBIDDEN).send(responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'No token provided!'));
    }
    const configJwtKey = process.env.JWTSECRETKEY;
    jsonwebtoken_1.default.verify(token === null || token === void 0 ? void 0 : token.split(' ')[1], configJwtKey, (err, decoded) => {
        if (err) {
            return res.status(http_status_1.default.UNAUTHORIZED).send(responseHandler_1.default.returnError(http_status_1.default.UNAUTHORIZED, 'Unauthorized'));
        }
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) === 'viewer') {
            next();
        }
        else {
            return res.status(http_status_1.default.FORBIDDEN).send(responseHandler_1.default.returnError(http_status_1.default.FORBIDDEN, 'Require viewer Role!'));
        }
    });
});
exports.isUser = isUser;
