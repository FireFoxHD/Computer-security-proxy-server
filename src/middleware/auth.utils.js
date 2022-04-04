import { check } from 'express-validator';

exports.signupValidation = [
    check('username', 'Name is required').not().isEmpty().toLowerCase().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }).escape(),
    check('password', 'Password must be 8 or more characters').isLength({ min: 8 })
]

exports.loginValidation = [
    //figure out how to log with email or username in same field (check both)
    check('username', 'Please use a valid username').not().isEmpty().toLowerCase().trim().escape(),
    check('password', 'Password must be 8 or more characters').isLength({ min: 8 })
]

