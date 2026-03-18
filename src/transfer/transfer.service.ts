// src/transfer/transfer.service.ts
import { db } from '../_helpers/db';
import { Transfer, TransferCreationAttributes } from './transfer.model';

export const transferService = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Transfer[]> {
    return await db.Transfer.findAll({
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' },
        ],
    });
}

async function getById(id: number): Promise<Transfer> {
    return await getTransfer(id);
}

async function getByUserId(userId: number): Promise<Transfer[]> {
    return await db.Transfer.findAll({
        where: { userId },
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' },
        ],
    });
}

async function create(params: TransferCreationAttributes): Promise<void> {
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }
    const fromDept = await db.Department.findByPk(params.fromDepartmentId);
    if (!fromDept) {
        throw new Error('From department not found');
    }
    const toDept = await db.Department.findByPk(params.toDepartmentId);
    if (!toDept) {
        throw new Error('To department not found');
    }
    if (params.fromDepartmentId === params.toDepartmentId) {
        throw new Error('From and to departments must be different');
    }
    await db.Transfer.create(params);
}

async function update(id: number, params: Partial<TransferCreationAttributes>): Promise<void> {
    const transfer = await getTransfer(id);
    if (params.userId) {
        const user = await db.User.findByPk(params.userId);
        if (!user) throw new Error('User not found');
    }
    if (params.fromDepartmentId) {
        const dept = await db.Department.findByPk(params.fromDepartmentId);
        if (!dept) throw new Error('From department not found');
    }
    if (params.toDepartmentId) {
        const dept = await db.Department.findByPk(params.toDepartmentId);
        if (!dept) throw new Error('To department not found');
    }
    await transfer.update(params);
}

async function _delete(id: number): Promise<void> {
    const transfer = await getTransfer(id);
    await transfer.destroy();
}

async function getTransfer(id: number): Promise<Transfer> {
    const transfer = await db.Transfer.findByPk(id, {
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' },
        ],
    });
    if (!transfer) {
        throw new Error('Transfer not found');
    }
    return transfer;
}