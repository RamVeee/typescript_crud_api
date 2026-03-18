"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const role_1 = require("../_helpers/role");
const validateRequest_1 = require("../_middleware/validateRequest");
const user_service_1 = require("./user.service");
const router = (0, express_1.Router)();
router.post('/register', registerSchema, register);
router.post('/login', loginSchema, login);
router.get('/profile', getProfile);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function register(req, res, next) {
    user_service_1.userService.register(req.body)
        .then(({ user, token }) => res.json({ user, token }))
        .catch(next);
}
function login(req, res, next) {
    user_service_1.userService.authenticate(req.body.email, req.body.password)
        .then(({ user, token }) => res.json({ user, token }))
        .catch(next);
}
function getProfile(req, res, next) {
    const user = req.user;
    res.json(user);
}
function getAll(req, res, next) {
    user_service_1.userService.getAll()
        .then((users) => res.json(users))
        .catch(next);
}
function getById(req, res, next) {
    user_service_1.userService.getById(Number(req.params.id))
        .then((users) => res.json(users))
        .catch(next);
}
function create(req, res, next) {
    console.log('create request body:', req.body);
    user_service_1.userService.create(req.body)
        .then(() => res.send('user created'))
        .catch(next);
}
function update(req, res, next) {
    user_service_1.userService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'User Updated' }))
        .catch(next);
}
function _delete(req, res, next) {
    user_service_1.userService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'User Deleted' }))
        .catch(next);
}
function registerSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).default(role_1.Role.User),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required(),
        phoneNumber: joi_1.default.string().min(10).required(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function loginSchema(req, res, next) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).default(role_1.Role.User),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required(),
        phoneNumber: joi_1.default.string().min(10).required(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().empty(''),
        firstName: joi_1.default.string().empty(''),
        lastName: joi_1.default.string().empty(''),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).empty(''),
        email: joi_1.default.string().email().empty(''),
        password: joi_1.default.string().min(6).empty(''),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).empty(''),
        phoneNumber: joi_1.default.string().min(10).empty(''),
    }).with('password', 'confirmPassword');
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
