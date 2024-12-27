import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController.js';
import proctected from '../middleware/authMiddleware.js';
const router = Router();

router.post('/', createUser);
router.get('/', proctected.authenticate, getUsers);

export default router;
