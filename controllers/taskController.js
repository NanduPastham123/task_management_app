import Task from '../models/task.js';  // Import Task as the default export

export const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, createdBy: req.user._id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

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
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Use Task.findByIdAndUpdate()
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
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
