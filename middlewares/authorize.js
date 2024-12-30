/**
 * This is middleware function to authorize or give access to the authenticated user based on role admin or user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns [] 401 if invalid otherwise pass to API handler
 */
// Middleware to authenticate user based on JWT
export const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};
