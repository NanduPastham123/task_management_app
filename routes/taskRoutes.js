import { Router } from 'express';
import { createNewTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import proctected from '../middlewares/authMiddleware.js';
import { validateTaskCreation, validateTaskUpdate } from '../middlewares/validateTask.js'

const router = Router();

router.post('/createNewTask', validateTaskCreation, proctected.authenticate, createNewTask);
router.get('/', proctected.authenticate, getTasks);
router.get('/:id', proctected.authenticate, getTaskById);
router.put('/updateTask/:id', validateTaskUpdate, proctected.authenticate, updateTask);
router.delete('/deleteTask/:id', proctected.authenticate, deleteTask);

export default router;
