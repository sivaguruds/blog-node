"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
const refresh_token_1 = __importDefault(require("./refresh_token"));
const user_token_1 = __importDefault(require("./user_token"));
class user extends sequelize_1.Model {
}
exports.user = user;
user.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false,
        values: ['admin', 'viewer'],
        defaultValue: 'viewer',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, { sequelize: connection_1.sequelize, tableName: 'users', timestamps: true });
user.hasOne(user_token_1.default, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'user_tokens',
});
user.hasOne(refresh_token_1.default, {
    foreignKey: 'userId',
    sourceKey: 'id',
    as: 'refresh_tokens',
});
user_token_1.default.belongsTo(user, {
    foreignKey: 'userId',
    as: 'users',
});
refresh_token_1.default.belongsTo(user, {
    foreignKey: 'userId',
    as: 'users',
});
exports.default = user;
