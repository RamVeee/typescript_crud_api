// src/request/request.controller.ts
import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from 'joi';
import { validateRequest } from "../_middleware/validateRequest";
import { requestService } from "./request.service";

const router = Router();

router.get('/', getAll);
router.get('/my', getMyRequests);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    requestService.getAll()
        .then((requests) => res.json(requests))
        .catch(next);
}

function getMyRequests(req: Request, res: Response, next: NextFunction): void {
    const userId = Number(req.query.userId ?? (req as any).user?.id);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }

    requestService.getByUserId(userId)
        .then((requests) => res.json(requests))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    requestService.getById(Number(req.params.id))
        .then((request) => res.json(request))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    const userId = Number((req as any).user?.id ?? req.body.userId);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }

    requestService.create({ ...req.body, userId })
        .then(() => res.json({ message: 'Request created' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    requestService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Request updated' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    requestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        userId: Joi.number().integer().optional(),
        type: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref('startDate')).required(),
        reason: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        type: Joi.string().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
        reason: Joi.string().optional(),
        status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
    });
    validateRequest(req, next, schema);
}