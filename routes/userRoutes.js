import express from 'express';
import { generateTokenForLoggedInUser, getAllUsersWithPagination, getAllUsers, createNewRegistrationForUser } from '../controllers/userController.js';
import proctected from '../middlewares/authMiddleware.js';
import { validateUserRegistration, validateUserLogin } from '../middlewares/validateUser.js';
import { authorize } from '../middlewares/authorize.js';


const router = express.Router();
router.post('/createNewRegistrationForUser', validateUserRegistration, createNewRegistrationForUser);
router.get('/getAllUsers', proctected.authenticate, authorize('admin'), getAllUsers);
router.get('/getAllUsersWithPagination',proctected.authenticate,authorize('admin'), getAllUsersWithPagination);
router.post('/generateTokenForLoggedInUser', validateUserLogin, generateTokenForLoggedInUser);


export default router;
