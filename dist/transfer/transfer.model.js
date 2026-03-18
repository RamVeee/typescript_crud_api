"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
exports.default = default_1;
// src/transfer/transfer.model.ts
const sequelize_1 = require("sequelize");
class Transfer extends sequelize_1.Model {
}
exports.Transfer = Transfer;
function default_1(sequelize) {
    Transfer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        fromDepartmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Departments',
                key: 'id',
            },
        },
        toDepartmentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Departments',
                key: 'id',
            },
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
        },
        dateRequested: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'Transfer',
        tableName: 'Transfers',
        timestamps: true,
    });
    return Transfer;
}
