import mongoose from 'mongoose';  // Correctly import mongoose

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', commentSchema);  // Export the model as default
