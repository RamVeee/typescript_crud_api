// src/employee/employee.service.ts
import { db } from '../_helpers/db';
import { Employee, EmployeeCreationAttributes } from './employee.model';

export const employeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Employee[]> {
    return await db.Employee.findAll({
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' },
        ],
    });
}

async function getById(id: number): Promise<Employee> {
    return await getEmployee(id);
}

async function create(params: EmployeeCreationAttributes): Promise<void> {
    // Check if user exists
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Check if department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department) {
        throw new Error('Department not found');
    }
    // Check if employee already exists for user
    const existing = await db.Employee.findOne({ where: { userId: params.userId } });
    if (existing) {
        throw new Error('Employee record already exists for this user');
    }
    await db.Employee.create(params);
}

async function update(id: number, params: Partial<EmployeeCreationAttributes>): Promise<void> {
    const employee = await getEmployee(id);
    if (params.userId) {
        const user = await db.User.findByPk(params.userId);
        if (!user) throw new Error('User not found');
    }
    if (params.departmentId) {
        const department = await db.Department.findByPk(params.departmentId);
        if (!department) throw new Error('Department not found');
    }
    await employee.update(params);
}

async function _delete(id: number): Promise<void> {
    const employee = await getEmployee(id);
    await employee.destroy();
}

async function getEmployee(id: number): Promise<Employee> {
    const employee = await db.Employee.findByPk(id, {
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' },
        ],
    });
    if (!employee) {
        throw new Error('Employee not found');
    }
    return employee;
}