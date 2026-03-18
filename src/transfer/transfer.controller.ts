// src/transfer/transfer.controller.ts
import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from 'joi';
import { validateRequest } from "../_middleware/validateRequest";
import { transferService } from "./transfer.service";

const router = Router();

router.get('/', getAll);
router.get('/my', getMyTransfers);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    transferService.getAll()
        .then((transfers) => res.json(transfers))
        .catch(next);
}

function getMyTransfers(req: Request, res: Response, next: NextFunction): void {
    const userId = Number(req.query.userId ?? (req as any).user?.id);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }

    transferService.getByUserId(userId)
        .then((transfers) => res.json(transfers))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    transferService.getById(Number(req.params.id))
        .then((transfer) => res.json(transfer))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    const userId = Number((req as any).user?.id ?? req.body.userId);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }

    transferService.create({ ...req.body, userId })
        .then(() => res.json({ message: 'Transfer request created' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    transferService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Transfer updated' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    transferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        userId: Joi.number().integer().optional(),
        fromDepartmentId: Joi.number().integer().required(),
        toDepartmentId: Joi.number().integer().required(),
        reason: Joi.string().required(),
        dateRequested: Joi.date().required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        fromDepartmentId: Joi.number().integer().optional(),
        toDepartmentId: Joi.number().integer().optional(),
        reason: Joi.string().optional(),
        status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
        dateRequested: Joi.date().optional(),
    });
    validateRequest(req, next, schema);
}