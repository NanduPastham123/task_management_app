import User from '../models/user.js';
import { AppError, errorHandler } from  '../middlewares/errorHandler.js';
import logger from '../utils/logger.js'; // Import the logger

/**
 * @description create a new user
 * @param {*} req
 * @param {*} res
 * @method POST/createNewRegistrationForUser
 */
export const createNewRegistrationForUser = async (req, res, next) => {
    try {
        // Extract request details
        const { username, email, password, role, isActive } = req.body;
        // Log the incoming registration attempt
        logger.info(`New user registration attempt: ${email}`);
        // Check if the user already exists
        const existingTaskUser = await User.findOne({ email });
        if (existingTaskUser) {
            logger.warn(`Email already in use: ${email}`); // Log the warning if email is already taken
            return next(new AppError('Email already in use', 400));
        }
        // Create a new user
        const newTaskUser = new User({ username, email, password, role, isActive });
        await newTaskUser.save();
        logger.info(`User successfully registered: ${email}`);
        // Respond with the new user details
        res.status(201).json(newTaskUser);
    } catch (err) {
        // Log the error and return a response
        logger.error(`Error during user registration: ${err.message}`);
        return next(new AppError('Failed at user creation', 400));
    }
};

/**
 * @description get all users based on Admin login without pagination
 * @param {*} res
 * @method GET/getAllUsers
 */
export const getAllUsers = async (req, res) => {
    try {
        logger.info('Fetching all users'); 
        const users = await User.find().lean();
        // Log the number of users retrieved
        logger.info(`Successfully fetched ${users.length} users`);
        res.status(200).json(users);
    } catch (err) {
        logger.error(`Error fetching all users: ${err.message}`);  // Log the error
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description get all users based on Admin login with pagination
 * @param {*} req
 * @param {*} res 
 * @method GET/getAllUsersWithPagination
 */
export const getAllUsersWithPagination = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        logger.info(`Fetching users with pagination - Page: ${page}, Limit: ${limit}`);

        const users = await User.find()
            .skip((page - 1) * limit)   // Skip users based on page number
            .limit(Number(limit));      // Limit the number of users per page

        const totalUsers = await User.countDocuments();  // Get total count for pagination

        logger.info(`Successfully fetched ${users.length} users for page ${page}`);

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (err) {
        logger.error(`Error fetching users with pagination: ${err.message}`);  // Log the error
        return next(new AppError('Internal server Error', 500));
    }
};

/**
 * @description generate a token based login credentials for role admin or user
 * @param {*} req
 * @param {*} res 
 * @method POST/generateTokenForLoggedInUser
 */
export const generateTokenForLoggedInUser = async (req, res) => {
    try {
        logger.info('User attempting to generate token'); // Log when a token generation request is received

        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Invalid login attempt: No user found with email ${email}`);  // Log invalid email attempts
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn(`Invalid login attempt: Incorrect password for email ${email}`);  // Log incorrect password attempts
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = user.generateAuthToken();

        logger.info(`Token generated successfully for user: ${email}`);  // Log successful token generation

        res.status(200).json({
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        logger.error(`Error generating token for user: ${error.message}`);  // Log any error that occurs
        return next(new AppError('Internal server Error', 500));
    }
};