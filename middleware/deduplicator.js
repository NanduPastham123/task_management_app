import { LRUCache } from "lru-cache";

// Create an LRU cache for deduplication
const deduplicationCache = new LRUCache({
    max: 500, // Maximum number of deduplication keys
    ttl: 60 * 1000, // Time-to-live for deduplication keys (in ms)
});

// Middleware for deduplication
export const deduplicator = (req, res, next) => {
    const dedupKey = `dedup:${req.originalUrl}:${JSON.stringify(req.body)}`;

    if (deduplicationCache.has(dedupKey)) {
        return res.status(429).json({
            message: `Duplicate request detected for key: ${dedupKey}. Please wait for the current request to complete.`,
        });
    }

    deduplicationCache.set(dedupKey, true);
    req.dedupKey = dedupKey;
    next();
};

// Cleanup deduplication key after the response
export const cleanupDedupKey = (req, res, next) => {
    //console.log("ComesTocleanupDedupKey")
    res.on("finish", () => {
        if (req.dedupKey) {
            deduplicationCache.delete(req.dedupKey);
        }
    });
    next();
};
