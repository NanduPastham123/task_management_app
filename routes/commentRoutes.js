import express from 'express';
import { createComment } from '../controllers/commentController.js';
import proctected from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', proctected.authenticate, createComment);

export default router;
