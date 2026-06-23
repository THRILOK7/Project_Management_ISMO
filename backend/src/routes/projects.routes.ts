import { Router } from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject, getDashboardMetrics } from '../controllers/projects.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { projectSchema } from '../schemas';

const router = Router();

router.use(protect);

// /dashboard must come before /:id so Express doesn't treat "dashboard" as an ID
router.route('/dashboard')
  .get(getDashboardMetrics);

router.route('/')
  .get(getProjects)
  .post(validate(projectSchema), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(validate(projectSchema), updateProject)
  .delete(deleteProject);

export default router;
