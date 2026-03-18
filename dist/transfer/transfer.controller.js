"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const transfer_service_1 = require("./transfer.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/my', getMyTransfers);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    transfer_service_1.transferService.getAll()
        .then((transfers) => res.json(transfers))
        .catch(next);
}
function getMyTransfers(req, res, next) {
    const userId = Number(req.query.userId ?? req.user?.id);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }
    transfer_service_1.transferService.getByUserId(userId)
        .then((transfers) => res.json(transfers))
        .catch(next);
}
function getById(req, res, next) {
    transfer_service_1.transferService.getById(Number(req.params.id))
        .then((transfer) => res.json(transfer))
        .catch(next);
}
function create(req, res, next) {
    const userId = Number(req.user?.id ?? req.body.userId);
    if (Number.isNaN(userId) || userId <= 0) {
        res.status(400).json({ message: 'userId is required' });
        return;
    }
    transfer_service_1.transferService.create({ ...req.body, userId })
        .then(() => res.json({ message: 'Transfer request created' }))
        .catch(next);
}
function update(req, res, next) {
    transfer_service_1.transferService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Transfer updated' }))
        .catch(next);
}
function _delete(req, res, next) {
    transfer_service_1.transferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().optional(),
        fromDepartmentId: joi_1.default.number().integer().required(),
        toDepartmentId: joi_1.default.number().integer().required(),
        reason: joi_1.default.string().required(),
        dateRequested: joi_1.default.date().required(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        fromDepartmentId: joi_1.default.number().integer().optional(),
        toDepartmentId: joi_1.default.number().integer().optional(),
        reason: joi_1.default.string().optional(),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected').optional(),
        dateRequested: joi_1.default.date().optional(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
