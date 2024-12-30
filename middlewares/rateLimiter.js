import rateLimit from "express-rate-limit";


/**
 * A rate limiter controls the number of requests or actions a user can perform within a specified time period to prevent abuse,
 *  ensure fair usage, and maintain system stability.
 */
const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 5 requests per minute
    message: { message: "Too many requests. Please try again later." },
});

export default rateLimiter;