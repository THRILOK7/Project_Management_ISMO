"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = require("../controllers/tasks.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../schemas");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.route('/')
    .get(tasks_controller_1.getTasks)
    .post((0, validate_middleware_1.validate)(schemas_1.taskSchema), tasks_controller_1.createTask);
router.route('/:id')
    .get(tasks_controller_1.getTaskById)
    .put((0, validate_middleware_1.validate)(schemas_1.taskUpdateSchema), tasks_controller_1.updateTask)
    .delete(tasks_controller_1.deleteTask);
exports.default = router;
