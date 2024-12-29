import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 5 requests per minute
    message: { message: "Too many requests. Please try again later." },
});

export default rateLimiter;