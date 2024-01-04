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
exports.refresh_token = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class refresh_token extends sequelize_1.Model {
}
exports.refresh_token = refresh_token;
refresh_token.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: 'user',
            key: 'id',
        },
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiryDate: {
        type: sequelize_1.DataTypes.DATE,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, { sequelize: connection_1.sequelize, tableName: 'refresh_tokens', timestamps: true });
refresh_token.verifyExpiration = function (token) {
    console.log(token.expiryDate.getTime(), new Date().getTime());
    return token.expiryDate.getTime() < new Date().getTime();
};
refresh_token.createToken = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);
        let _token = (0, uuid_1.v4)();
        let refreshToken = yield refresh_token.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });
        return refreshToken.token;
    });
};
exports.default = refresh_token;
