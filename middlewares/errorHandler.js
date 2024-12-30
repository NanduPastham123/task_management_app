import logger from '../utils/logger.js'; // Import the logger

// Custom error class for operational errors
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Mark the error as operational
    }
}

// Centralized error-handling middleware
export const errorHandler = (err, req, res, next) => {
    const { statusCode = 500, status = 'error', message } = err;

    // Log the error details
    if (process.env.NODE_ENV === 'development') {
        logger.debug({
            message,
            statusCode,
            stack: err.stack,
        });
    } else {
        logger.error({
            message,
            statusCode,
        });
    }

    // Send a user-friendly error response
    res.status(statusCode).json({
        status,
        message: err.isOperational ? message : 'Internal Server Error',
    });
};
