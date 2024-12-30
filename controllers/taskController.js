import Task from '../models/task.js';  // Import Task as the default export
import logger from '../utils/logger.js';
import { AppError, errorHandler } from  '../middlewares/errorHandler.js';

/**
 * @description create a new task based on user
 * @param {*} req
 * @param {*} res 
 * @method POST/createNewUserTask
 */
export const createNewUserTask = async (req, res) => {
    try {
        // Extract data from the request body
        const { title, description, dueDate, priority, status, assignedTo } = req.body;
        let assigned = assignedTo || null;

        // Log task creation attempt
        logger.info(`Creating a new task - Title: ${title}, Assigned To: ${assignedTo}`);

        // Create the task
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            createdBy: req.user.id,  // Get logged-in user's ID from auth middleware
            assigned
        });

        // Save the task to the database
        await task.save();

        // Log task creation success
        logger.info(`Task created successfully - Task ID: ${task._id}`);

        // Respond with success message
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        // Log the error with details
        logger.error(`Error creating task: ${error.message}`);

        // Respond with server error
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description get all tasks based on Admin login without pagination
 * @param {*} res  
 * @method GET/getAllTasks
 */
export const getAllTasks = async (req, res) => {
    try {
        logger.info('Fetching all tasks');  // Log when the request to fetch all tasks is made

        const tasks = await Task.find().lean();

        logger.info(`Successfully fetched ${tasks.length} tasks`);  // Log the number of tasks retrieved

        res.status(200).json(tasks);
    } catch (err) {
        logger.error(`Error fetching tasks: ${err.message}`);  // Log the error with message
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description get all tasks based on Admin login with pagination 
 * @param {*} req
 * @param {*} res 
 * @method GET/getAllTasksWithPagination
 */
export const getAllTasksWithPagination = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        logger.info(`Fetching tasks with pagination - Page: ${page}, Limit: ${limit}`);  // Log pagination details

        const tasks = await Task.find()
            .skip((page - 1) * limit)  // Skip tasks based on page number
            .limit(Number(limit));     // Limit the number of tasks per page

        const totalTasks = await Task.countDocuments();  // Get total count for pagination

        logger.info(`Successfully fetched ${tasks.length} tasks for page ${page}`);  // Log the number of tasks fetched

        res.status(200).json({
            tasks,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page
        });
    } catch (err) {
        logger.error(`Error fetching tasks with pagination: ${err.message}`);  // Log error with message
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description update a new task based on user
 * @param {*} req
 * @param {*} res 
 * @method POST/updateTask
 */
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, status } = req.body;

        logger.info(`Attempting to update task with ID: ${id}`);  // Log the task update attempt

        const task = await Task.findById(id);
        if (!task) {
            logger.warn(`Task not found with ID: ${id}`);  // Log when task is not found
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;

        await task.save();

        logger.info(`Task updated successfully - Task ID: ${id}`);  // Log task update success

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        logger.error(`Error updating task: ${err.message}`);  // Log the error
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description delete a task based on user
 * @param {*} req
 * @param {*} res 
 * @method DELETE/deleteTask
 */
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        logger.info(`Attempting to delete task with ID: ${id}`);  // Log the task delete attempt

        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            logger.warn(`Task not found with ID: ${id}`);  // Log when task is not found
            return res.status(404).json({ message: 'Task not found' });
        }

        logger.info(`Task deleted successfully - Task ID: ${id}`);  // Log task deletion success

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        logger.error(`Error deleting task: ${err.message}`);  // Log the error
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description get a task based on unique task with filtering and pagination
 * @param {*} req
 * @param {*} res
 * @method GET/getTasksWithCommentsById
 */
export const getTasksWithCommentsById = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 comments per page

        logger.info(`Fetching task with ID: ${id} and comments (Page: ${page}, Limit: ${limit})`);  // Log the task fetch attempt

        const task = await Task.findById(id).populate('comments');
        if (!task) {
            logger.warn(`Task not found with ID: ${id}`);  // Log when task is not found
            return next(new AppError('Task not found', 404));
        }

        const totalComments = task.comments.length; // Total number of comments
        const totalPages = Math.ceil(totalComments / limit);
        let transform = (page - 1) * limit;  // Calculate comment offset
        const paginatedComments = task.comments.slice(transform, page * limit);  // Paginate comments

        logger.info(`Successfully fetched task with ID: ${id}. Total comments: ${totalComments}. Total pages: ${totalPages}`);  // Log success

        res.status(200).json({
            task: {
                ...task.toObject(),
                comments: paginatedComments, // Include only paginated comments
            },
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalComments,
                limit: Number(limit),
            },
        });
    } catch (err) {
        logger.error(`Error fetching task with comments: ${err.message}`);  // Log the error
        return next(new AppError('Internal server Error', 500));
    }
};