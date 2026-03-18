// src/request/request.service.ts
import { db } from '../_helpers/db';
import { Request, RequestCreationAttributes } from './request.model';

export const requestService = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Request[]> {
    return await db.Request.findAll({
        include: [{ model: db.User, as: 'user' }],
    });
}

async function getById(id: number): Promise<Request> {
    return await getRequest(id);
}

async function getByUserId(userId: number): Promise<Request[]> {
    return await db.Request.findAll({
        where: { userId },
        include: [{ model: db.User, as: 'user' }],
    });
}

async function create(params: RequestCreationAttributes): Promise<void> {
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }
    await db.Request.create(params);
}

async function update(id: number, params: Partial<RequestCreationAttributes>): Promise<void> {
    const request = await getRequest(id);
    await request.update(params);
}

async function _delete(id: number): Promise<void> {
    const request = await getRequest(id);
    await request.destroy();
}

async function getRequest(id: number): Promise<Request> {
    const request = await db.Request.findByPk(id, {
        include: [{ model: db.User, as: 'user' }],
    });
    if (!request) {
        throw new Error('Request not found');
    }
    return request;
}