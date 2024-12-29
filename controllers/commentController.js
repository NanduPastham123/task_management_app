import Comment from '../models/comment.js';
import Task from '../models/task.js';

export const addCommentToTask = async (req, res) => {
    try {
        // const taskId = req.params.id;
        const { content } = req.body;
        //console.log("TASKID::" + taskId)

        // Create a new comment
        const comment = new Comment({ content, createdBy: req.user.id });
        await comment.save();

        // Add comment reference to the task
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: comment._id } },
            { new: true }
        ).populate('comments')
        console.log(task)

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

