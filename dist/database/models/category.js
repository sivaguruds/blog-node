"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.category = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
class category extends sequelize_1.Model {
}
exports.category = category;
category.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, { sequelize: connection_1.sequelize, tableName: 'categories', timestamps: true });
exports.default = category;
