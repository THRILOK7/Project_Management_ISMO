"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../schemas");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { error: 'Too many login attempts, please try again after 15 minutes' },
});
router.post('/register', authLimiter, (0, validate_middleware_1.validate)(schemas_1.registerSchema), auth_controller_1.registerUser);
router.post('/login', authLimiter, (0, validate_middleware_1.validate)(schemas_1.loginSchema), auth_controller_1.loginUser);
router.post('/logout', auth_controller_1.logoutUser);
exports.default = router;
