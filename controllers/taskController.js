import Task from '../models/task.js';  // Import Task as the default export

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

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('createdBy assignedTo comments');  // Use Task.find() instead
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('createdBy assignedTo comments');  // Use Task.findById()
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

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
