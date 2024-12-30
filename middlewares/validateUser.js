import { body, validationResult } from 'express-validator';
//import emailValidator from 'email-validator';
export const validateUserRegistration = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username should be at least 3 characters long'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .matches(/^.+@gmail\.com$/).withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role should be either user or admin'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let error = JSON.parse(JSON.stringify(errors.array()[0]));
            console.log("eeeee::" + error['msg']);
            return res.status(400).json({ errors: error['msg'] });
        }
        next();
    }
];


// Validation for user login
export const validateUserLogin = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .matches(/^.+@gmail\.com$/).withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Please proved the more or equal to 6 characters long password'),

    // Middleware to check validation results
    (req, res, next) => {
        console.log("comesAtvalidateloginUser")
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let error = JSON.parse(JSON.stringify(errors.array()[0]));
            console.log("eeeee::" + error['msg']);
            return res.status(400).json({ errors: error['msg'] });
        }
        next();
    }
];

