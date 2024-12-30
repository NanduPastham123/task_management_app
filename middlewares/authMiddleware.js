import jwt from 'jsonwebtoken';
import User from '../models/user.js';


/**
 * This is middleware function to authenticate user based on the JWT token and return the true if valid
 * @param {*} req
 * @param {*} res
 * @returns [] 401 if invalid otherwise pass to API handler
 */
// Middleware to authenticate user based on JWT
export const authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
            //console.log('requested authorization token is missing')
            return res.status(401).json({ message: 'Missing Authorization Header' })
        }
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("decoded::" + JSON.stringify(decoded))
        const user = await User.findById(decoded.id);
        console.log("CHECKuser::: " + user)

        if (!user) {
            return res.status(401).json({ message: 'Invalid token or user no longer exists' });
        }

        // Attach user details to the request object
        req.user = { id: user._id, email: user.email, role: user.role };
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.log(error.stack);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

export default { authenticate };