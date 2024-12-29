import express from 'express';
import { addCommentToTask } from '../controllers/commentController.js';
import proctected from '../middlewares/authMiddleware.js';
import validateComment from '../middlewares/validateComment.js'

const router = express.Router();

router.post('/addCommentToTask/:id', validateComment, proctected.authenticate, addCommentToTask);

export default router;
