import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import proctected from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', proctected.authenticate, createTask);
router.get('/', proctected.authenticate, getTasks);
router.get('/:id', proctected.authenticate, getTaskById);
router.put('/:id', proctected.authenticate, updateTask);
router.delete('/:id', proctected.authenticate, deleteTask);

export default router;
