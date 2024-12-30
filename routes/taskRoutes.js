import { Router } from 'express';
import { createNewUserTask, getTasksWithCommentsById, updateTask, deleteTask, getAllTasksWithPagination, getAllTasks } from '../controllers/taskController.js';
import proctected from '../middlewares/authMiddleware.js';
import { validateTaskCreation, validateTaskUpdate, validateGetTaskById } from '../middlewares/validateTask.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.post('/createNewUserTask', validateTaskCreation, proctected.authenticate,authorize('user'), createNewUserTask);
router.get('/getAllTasks', proctected.authenticate, getAllTasks);
router.get('/getAllTasksWithPagination', proctected.authenticate,authorize('admin'), getAllTasksWithPagination);
router.get('/getTasksWithCommentsById/:id', validateGetTaskById, proctected.authenticate,authorize('user'), getTasksWithCommentsById);
router.put('/updateTask/:id', validateTaskUpdate, proctected.authenticate,authorize('user'), updateTask);
router.delete('/deleteTask/:id', proctected.authenticate,authorize('user'), deleteTask);

export default router;
