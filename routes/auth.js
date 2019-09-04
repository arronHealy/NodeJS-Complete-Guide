const express = require('express');

const { check, body } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            /*if (value === 'arron@mail.com') {
                throw new Error('Email is forbidden');
            }
            return true;*/
            return User
                .findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-mail exists already. Please Try Again!');
                    }
                });
        })
        .normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
], authController.postSignup);

router.get('/login', authController.getLogin);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password', 'Invalid password. Please enter correct password!!!')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], authController.postLogin);

router.post('/logout', authController.postLogout);


module.exports = router;