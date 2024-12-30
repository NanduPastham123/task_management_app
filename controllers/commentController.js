import Comment from '../models/comment.js';
import Task from '../models/task.js';
import { AppError } from '../middlewares/errorHandler.js';  // Import the custom AppError class
import logger from '../utils/logger.js'; // Assuming your logger is set up properly


export const addCommentToTask = async (req, res, next) => {
    try {
        const { content } = req.body;
        const taskId = req.params.id;

        // Log the request to add a comment
        logger.info(`Request to add comment to task with ID: ${taskId}. User ID: ${req.user.id}`);

        // Create a new comment
        const comment = new Comment({ content, createdBy: req.user.id });
        await comment.save();

        // Add comment reference to the task
        const task = await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } }, { new: true }).populate('comments');

        if (!task) {
            // Use AppError for handling task not found error
            return next(new AppError('Task not found', 404)); 
        }

        // Log successful comment addition
        logger.info(`Comment added successfully to task with ID: ${taskId}. User ID: ${req.user.id}`);

        res.status(200).json(task);
    } catch (error) {
        // If an unexpected error occurs, pass it to the centralized error handler
        return next(new AppError('Server error', 500));
    }
};
