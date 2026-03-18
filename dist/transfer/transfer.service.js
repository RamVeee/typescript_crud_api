"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferService = void 0;
// src/transfer/transfer.service.ts
const db_1 = require("../_helpers/db");
exports.transferService = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete,
};
async function getAll() {
    return await db_1.db.Transfer.findAll({
        include: [
            { model: db_1.db.User, as: 'user' },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' },
        ],
    });
}
async function getById(id) {
    return await getTransfer(id);
}
async function getByUserId(userId) {
    return await db_1.db.Transfer.findAll({
        where: { userId },
        include: [
            { model: db_1.db.User, as: 'user' },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' },
        ],
    });
}
async function create(params) {
    const user = await db_1.db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }
    const fromDept = await db_1.db.Department.findByPk(params.fromDepartmentId);
    if (!fromDept) {
        throw new Error('From department not found');
    }
    const toDept = await db_1.db.Department.findByPk(params.toDepartmentId);
    if (!toDept) {
        throw new Error('To department not found');
    }
    if (params.fromDepartmentId === params.toDepartmentId) {
        throw new Error('From and to departments must be different');
    }
    await db_1.db.Transfer.create(params);
}
async function update(id, params) {
    const transfer = await getTransfer(id);
    if (params.userId) {
        const user = await db_1.db.User.findByPk(params.userId);
        if (!user)
            throw new Error('User not found');
    }
    if (params.fromDepartmentId) {
        const dept = await db_1.db.Department.findByPk(params.fromDepartmentId);
        if (!dept)
            throw new Error('From department not found');
    }
    if (params.toDepartmentId) {
        const dept = await db_1.db.Department.findByPk(params.toDepartmentId);
        if (!dept)
            throw new Error('To department not found');
    }
    await transfer.update(params);
}
async function _delete(id) {
    const transfer = await getTransfer(id);
    await transfer.destroy();
}
async function getTransfer(id) {
    const transfer = await db_1.db.Transfer.findByPk(id, {
        include: [
            { model: db_1.db.User, as: 'user' },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' },
        ],
    });
    if (!transfer) {
        throw new Error('Transfer not found');
    }
    return transfer;
}
