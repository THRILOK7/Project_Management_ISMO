"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_controller_1 = require("../controllers/projects.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../schemas");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.route('/')
    .get(projects_controller_1.getProjects)
    .post((0, validate_middleware_1.validate)(schemas_1.projectSchema), projects_controller_1.createProject);
router.route('/:id')
    .get(projects_controller_1.getProjectById)
    .put((0, validate_middleware_1.validate)(schemas_1.projectSchema), projects_controller_1.updateProject)
    .delete(projects_controller_1.deleteProject);
exports.default = router;
