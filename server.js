import dotenv from 'dotenv';
dotenv.config();
import rateLimiter from './middlewares/rateLimiter.js';
import { deduplicator, cleanupDedupKey } from './middlewares/deduplicator.js';
import { AppError, errorHandler } from  './middlewares/errorHandler.js'
import express, { json } from 'express';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


//Database connection
import connectToMongoDB from "./config/mongodb.js";
const app = express();
app.use(json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
// Applying rate limiter globally
app.use(rateLimiter);

app.use(deduplicator);
app.use(cleanupDedupKey);


app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
// Applying Error handler globally to all routes
// Catch-all route for undefined paths
app.use((req, res, next) => {
    next(new AppError('Route not found!', 404));
});

// Centralized error handler
app.use(errorHandler);
app.listen(process.env.PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${process.env.PORT}`);
});
