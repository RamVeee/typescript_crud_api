// src/transfer/transfer.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from 'sequelize';

export interface TransferAttributes {
    id: number;
    userId: number;
    fromDepartmentId: number;
    toDepartmentId: number;
    reason: string;
    status: string; // 'pending', 'approved', 'rejected'
    dateRequested: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransferCreationAttributes
    extends Optional<TransferAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Transfer
    extends Model<TransferAttributes, TransferCreationAttributes>
    implements TransferAttributes {

    public id!: number;
    public userId!: number;
    public fromDepartmentId!: number;
    public toDepartmentId!: number;
    public reason!: string;
    public status!: string;
    public dateRequested!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Transfer {
    Transfer.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            fromDepartmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Departments',
                    key: 'id',
                },
            },
            toDepartmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Departments',
                    key: 'id',
                },
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending',
            },
            dateRequested: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Transfer',
            tableName: 'Transfers',
            timestamps: true,
        }
    );

    return Transfer;
}