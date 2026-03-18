// src/_helpers/db.ts
import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

export interface Database {
    User: any;
    Department: any;
    Employee: any;
    Request: any;
    Transfer: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const { host, port, user, password, database } = config.database;

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    const { default: userModel } = await import('../users/user.model');
    db.User = userModel(sequelize);

    const { default: departmentModel } = await import('../department/department.model');
    db.Department = departmentModel(sequelize);

    const { default: employeeModel } = await import('../employee/employee.model');
    db.Employee = employeeModel(sequelize);

    const { default: requestModel } = await import('../request/request.model');
    db.Request = requestModel(sequelize);

    const { default: transferModel } = await import('../transfer/transfer.model');
    db.Transfer = transferModel(sequelize);

    // Associations
    db.User.hasOne(db.Employee, { foreignKey: 'userId', as: 'employee' });
    db.Employee.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

    db.Department.hasMany(db.Employee, { foreignKey: 'departmentId', as: 'employees' });
    db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

    db.User.hasMany(db.Request, { foreignKey: 'userId', as: 'requests' });
    db.Request.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

    db.User.hasMany(db.Transfer, { foreignKey: 'userId', as: 'transfers' });
    db.Transfer.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

    db.Department.hasMany(db.Transfer, { foreignKey: 'fromDepartmentId', as: 'fromTransfers' });
    db.Transfer.belongsTo(db.Department, { foreignKey: 'fromDepartmentId', as: 'fromDepartment' });

    db.Department.hasMany(db.Transfer, { foreignKey: 'toDepartmentId', as: 'toTransfers' });
    db.Transfer.belongsTo(db.Department, { foreignKey: 'toDepartmentId', as: 'toDepartment' });

    // Use sync() without alter to avoid schema-alter errors (e.g. too many keys).
    // If you need schema changes, run migrations or manually adjust the database.
    await sequelize.sync();

    console.log('Database initialized and models synced');
}