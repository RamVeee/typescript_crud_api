// src/employee/employee.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from 'sequelize';

export interface EmployeeAttributes {
    id: number;
    userId: number;
    departmentId: number;
    position: string;
    hireDate: Date;
    salary?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmployeeCreationAttributes
    extends Optional<EmployeeAttributes, 'id' | 'createdAt' | 'updatedAt' | 'salary'> {}

export class Employee
    extends Model<EmployeeAttributes, EmployeeCreationAttributes>
    implements EmployeeAttributes {

    public id!: number;
    public userId!: number;
    public departmentId!: number;
    public position!: string;
    public hireDate!: Date;
    public salary?: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Employee {
    Employee.init(
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
            departmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Departments',
                    key: 'id',
                },
            },
            position: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            hireDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
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
            modelName: 'Employee',
            tableName: 'Employees',
            timestamps: true,
        }
    );

    return Employee;
}