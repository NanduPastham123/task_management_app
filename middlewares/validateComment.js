import { body, validationResult } from 'express-validator';

export const validateComment = [
    body('content').notEmpty().withMessage('Comment text is required'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default validateComment;