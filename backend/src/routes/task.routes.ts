import { Router } from 'express';
import { body, check } from 'express-validator';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from '../controllers/tasks.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { validateFields } from '../middleware/validateFields';

const router = Router();

router.use(verifyToken);

router.post(
  '/',
  [
    body('title', 'El título es requerido').notEmpty(),
    body('description', 'La description tiene que ser string')
      .optional()
      .isString(),
    body('status').optional().isIn(['pendiente', 'en progreso', 'completada']),
    body('dueDate', 'Fecha limite erronea').optional().isISO8601(),
    validateFields,
  ],
  createTask
);

router.get('/', getTasks);
router.get('/:id', getTaskById);

router.patch(
  '/:id',
  [
    check('status').optional().isIn(['pendiente', 'en progreso', 'completada']),
    validateFields,
  ],
  updateTask
);

router.delete('/:id', deleteTask);

export default router;
