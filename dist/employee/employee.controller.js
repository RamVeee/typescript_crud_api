"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const employee_service_1 = require("./employee.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    employee_service_1.employeeService.getAll()
        .then((employees) => res.json(employees))
        .catch(next);
}
function getById(req, res, next) {
    employee_service_1.employeeService.getById(Number(req.params.id))
        .then((employee) => res.json(employee))
        .catch(next);
}
function create(req, res, next) {
    employee_service_1.employeeService.create(req.body)
        .then(() => res.json({ message: 'Employee created' }))
        .catch(next);
}
function update(req, res, next) {
    employee_service_1.employeeService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Employee updated' }))
        .catch(next);
}
function _delete(req, res, next) {
    employee_service_1.employeeService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Employee deleted' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().required(),
        departmentId: joi_1.default.number().integer().required(),
        position: joi_1.default.string().required(),
        hireDate: joi_1.default.date().required(),
        salary: joi_1.default.number().min(0).optional(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().optional(),
        departmentId: joi_1.default.number().integer().optional(),
        position: joi_1.default.string().optional(),
        hireDate: joi_1.default.date().optional(),
        salary: joi_1.default.number().min(0).optional(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
