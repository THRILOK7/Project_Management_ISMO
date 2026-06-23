import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/tasks.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { taskSchema, taskUpdateSchema } from '../schemas';

const router = Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validate(taskSchema), createTask);

router.route('/:id')
  .get(getTaskById)
  .put(validate(taskUpdateSchema), updateTask)
  .delete(deleteTask);

export default router;
