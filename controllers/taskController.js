import Task from '../models/task.js';  // Import Task as the default export
import Comment from '../models/comment.js';

export const createNewTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, assignedTo } = req.body;
        let assigned = assignedTo || null;
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            createdBy: req.user.id, // get logged-in user's ID from auth middleware
            assigned
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().lean()
        res.status(200).json(tasks);
    } catch (err) {
        console.log("error: " + err.message)
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllTasksWithPagination = async (req, res) => {
    try {
        console.log('comeshere')
        const { page = 1, limit = 10 } = req.query;
        const tasks = await Task.find().lean()
            .skip((page - 1) * limit)  // Skip users based on page number
            .limit(Number(limit));     // Limit the number of users per page

        const totalTasks = await Task.countDocuments();  // Get total count for pagination
        res.status(200).json({
            tasks,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page
        });
    } catch (err) {
        console.log("error: " + err.message)
        res.status(500).json({ message: 'Internal Server error' });
    }
}


// export const getTaskById = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id).populate('createdBy assignedTo comments');  // Use Task.findById()
//         if (!task) return res.status(404).json({ message: 'Task not found' });
//         res.status(200).json(task);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, status } = req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;

        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);  // Use Task.findByIdAndDelete()
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export const getTasksWithCommentsById = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 comments per page

        // Fetch the task
        const task = await Task.findById(id)
            .populate('comments'); // Populate the comments
        console.log("TASKS:::", task)

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Apply pagination to comments
        const totalComments = task.comments.length; // Total number of comments
        console.log("LengthOfComments::" + totalComments)
        const totalPages = Math.ceil(totalComments / limit);
        console.log("TotalPages:" + totalPages)
        let transform = (page - 1) * limit;
        console.log("transform:" + transform)
        // Paginate comments
        const paginatedComments = task.comments.slice(transform, page * limit);
        console.log('PaginatedComments:' + paginatedComments)

        // Return paginated data
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
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
