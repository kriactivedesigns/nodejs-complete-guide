const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../constants/global-constants');

exports.signup = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hashPass = await bcrypt.hash(password, 12)
        const user = new User({
            name: name,
            email: email,
            password: hashPass
        })
        await user.save();
        res.status(201).json({ message: "User successfully created.", userId: result._id })
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
}

exports.login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email })
        if(!user) {
            const error = new Error(`User with email ${email} is not found!!!`);
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual) {
            const error = new Error(`Invalid password!!!`);
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            constants.GlobalConstants.secretKey,
            { expiresIn: '1h' }
        )

        res.status(200).json({ 
            message: 'User login success.',
            userId: loadedUser._id.toString(),
            token: token
        })
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err);
    }
}