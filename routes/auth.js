const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router()

router.get('/login', authController.getLogin)
router.get('/signup',authController.getSignup)
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(user => {
                    if(user) {
                        return Promise.reject('E-Mail already exists, please pick a diffrent one.')
                    }
                })
            })
            .normalizeEmail(),
        body(
                'password',
                'Please enter a password with only numbers and text and at least 5 characters'
            )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if(value !== req.body.password){
                    throw new Error("Passwords do not match")
                }
                return true
            })
    ],
    authController.postSignup
)
router.post(
    '/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(user => {
                    if(!user) {
                        return Promise.reject('User does not exists')
                    }
                })
        })
    ],
    authController.postLogin
)
router.post('/logout',authController.postLogout)
router.get('/reset',authController.getResetPassword)
router.post('/reset',authController.postResetPassword)
router.get('/newpass/:token',authController.getNewPassword)
router.post('/newpass',authController.postNewPassword)

module.exports = router;