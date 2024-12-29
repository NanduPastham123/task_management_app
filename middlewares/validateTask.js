import { body, param, validationResult } from 'express-validator';

// Validation for task creation
export const validateTaskCreation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title should be at least 3 characters long'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 5 }).withMessage('Description should be at least 5 characters long'),
    body('dueDate')
        .notEmpty().withMessage('Due date is required')
        .isDate().withMessage('Due date must be a valid date'),
    // body('priority')
    //     .optional()
    //     .custom((value) => {
    //         if (value === '') return 'Medium'; // Replace empty string with default
    //         if (!['Low', 'Medium', 'High'].includes(value)) {
    //             throw new Error('Priority should be one of Low, Medium, High');
    //         }
    //         return value;
    //     }),
    // body('status')
    //     .optional()
    //     .custom((value) => {
    //         if (value === '') return 'Pending'; // Replace empty string with default
    //         if (!['Pending', 'In Progress', 'Completed'].includes(value)) {
    //             throw new Error('Status should be one of Pending, In Progress, Completed');
    //         }
    //         return value;
    //     })
    // ,

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation for task update (you can check task ID format)
export const validateTaskUpdate = [
    param('id')
        .isMongoId().withMessage('Task ID should be a valid MongoDB ObjectId'),
    body('title')
        .optional().isLength({ min: 3 }).withMessage('Title should be at least 3 characters long'),
    body('description')
        .optional().isLength({ min: 5 }).withMessage('Description should be at least 5 characters long'),
    body('dueDate')
        .optional().isDate().withMessage('Due date must be a valid date'),
    body('priority')
        .optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority should be one of Low, Medium, High'),
    body('status')
        .optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Status should be one of Pending, In Progress, Completed'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
