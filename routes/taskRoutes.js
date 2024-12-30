import { Router } from 'express';
import { createNewTask, getTasksWithCommentsById, updateTask, deleteTask, getAllTasksWithPagination, getAllTasks } from '../controllers/taskController.js';
import proctected from '../middlewares/authMiddleware.js';
import { validateTaskCreation, validateTaskUpdate, validateGetTaskById } from '../middlewares/validateTask.js'

const router = Router();

router.post('/createNewTask', validateTaskCreation, proctected.authenticate, createNewTask);
router.get('/getAllTasks', proctected.authenticate, getAllTasks);
router.get('/getAllTasksWithPagination', proctected.authenticate, getAllTasksWithPagination);
router.get('/getTasksWithCommentsById/:id', validateGetTaskById, proctected.authenticate, getTasksWithCommentsById);
router.put('/updateTask/:id', validateTaskUpdate, proctected.authenticate, updateTask);
router.delete('/deleteTask/:id', proctected.authenticate, deleteTask);

export default router;
