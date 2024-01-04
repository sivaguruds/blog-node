"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_token = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
class user_token extends sequelize_1.Model {
}
exports.user_token = user_token;
user_token.init({
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
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, { sequelize: connection_1.sequelize, tableName: 'user_tokens', timestamps: true });
exports.default = user_token;
