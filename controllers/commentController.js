import Comment from '../models/comment.js';

export const createComment = async (req, res) => {

    try {
        const comment = new Comment({ ...req.body, createdBy: req.user._id });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
