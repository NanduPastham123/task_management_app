import express from 'express';
import userControllers from '../controllers/userController.js';
import proctected from '../middleware/authMiddleware.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validateUser.js';

console.log(` => ComesTouserRoutes`)
const router = express.Router();
router.post('/createNewRegistrationForUser', validateUserRegistration, userControllers.createNewRegistrationForUser);
router.get('/getUsers', proctected.authenticate, userControllers.getUsers);
router.post('/createTokenForLoggedInUser', proctected.authenticate, validateUserLogin, userControllers.createTokenForLoggedInUser);

export default router;
