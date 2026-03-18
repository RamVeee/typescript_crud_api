"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const request_service_1 = require("./request.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/my', getMyRequests);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    request_service_1.requestService.getAll()
        .then((requests) => res.json(requests))
        .catch(next);
}
function getMyRequests(req, res, next) {
    const userId = Number(req.query.userId ?? req.user?.id);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }
    request_service_1.requestService.getByUserId(userId)
        .then((requests) => res.json(requests))
        .catch(next);
}
function getById(req, res, next) {
    request_service_1.requestService.getById(Number(req.params.id))
        .then((request) => res.json(request))
        .catch(next);
}
function create(req, res, next) {
    const userId = Number(req.user?.id ?? req.body.userId);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }
    request_service_1.requestService.create({ ...req.body, userId })
        .then(() => res.json({ message: 'Request created' }))
        .catch(next);
}
function update(req, res, next) {
    request_service_1.requestService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Request updated' }))
        .catch(next);
}
function _delete(req, res, next) {
    request_service_1.requestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().optional(),
        type: joi_1.default.string().required(),
        startDate: joi_1.default.date().required(),
        endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required(),
        reason: joi_1.default.string().required(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        type: joi_1.default.string().optional(),
        startDate: joi_1.default.date().optional(),
        endDate: joi_1.default.date().optional(),
        reason: joi_1.default.string().optional(),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected').optional(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
