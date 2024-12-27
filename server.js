import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);
app.use(errorHandler);
// Database connection and server startup
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
//     .catch(err => console.error(err));

export default server;