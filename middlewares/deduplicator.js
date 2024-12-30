import logger from '../utils/logger.js';  // Assuming your logger is set up properly
import { LRUCache } from 'lru-cache';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * implemented an LRU cache for deduplication
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns [] 401 if invalid otherwise pass to API handler
 */
const deduplicationCache = new LRUCache({
    max: 500, // Maximum number of deduplication keys
    ttl: 60 * 1000, // Time-to-live for deduplication keys (in ms)
});

/**
 * This is middleware function for deduplication of request from twice with same records
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns [] 401 if invalid otherwise pass to API handler
 */
export const deduplicator = async (req, res, next) => {
    try {
        const dedupKey = `dedup:${req.originalUrl}:${JSON.stringify(req.body)}`;
        // Check if the request has already been processed within the TTL
        if (deduplicationCache.has(dedupKey)) {
            // Log the duplicate request
            logger.warn(`Duplicate request detected for key: ${dedupKey}. User IP: ${req.ip}, URL: ${req.originalUrl}`);
            return next(new AppError('Duplicate request detected for key: ${dedupKey}. Please wait for the current request to complete.', 429));
            //  res.status(429).json({
            //     message: `Duplicate request detected for key: ${dedupKey}. Please wait for the current request to complete.`,
            // });
        }
        // Log the first occurrence of the request
        logger.info(`New request with deduplication key: ${dedupKey} - IP: ${req.ip}, URL: ${req.originalUrl}`);

        // Set the deduplication cache
        deduplicationCache.set(dedupKey, true);

        // Attach the deduplication key to the request object for subsequent middlewares or route handlers
        req.dedupKey = dedupKey;
        next();
    } catch (error) {
        // Log error and send server error response
        logger.error(`Error in deduplication middleware: ${error.message} - IP: ${req.ip}, URL: ${req.originalUrl}`);
        return next(new AppError('Server error', 500));
    }
};

/**
 * This is middleware cleanup deduplication key after the response
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns [] 401 if invalid otherwise pass to API handler
 */
export const cleanupDedupKey = async (req, res, next) => {
    try {
        res.on("finish", () => {
            if (req.dedupKey) {
                // Log the cleanup of the deduplication key
                logger.info(`Cleaning up deduplication key: ${req.dedupKey} - IP: ${req.ip}, URL: ${req.originalUrl}`);
                deduplicationCache.delete(req.dedupKey);
            }
        });
        next();
    } catch (error) {
        // Log error and send server error response
        logger.error(`Error in cleanupDedupKey middleware: ${error.message} - IP: ${req.ip}, URL: ${req.originalUrl}`);
        return next(new AppError('Internal server error', 500));
    }
};
