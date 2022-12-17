const jwt = require('jsonwebtoken');
const constants = require('../constants/global-constants');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const err = new Error('User not Authorized!!')
        err.statusCode = 401;
        throw err
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, constants.GlobalConstants.secretKey);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken) {
        const err = new Error('User not Authorized!!')
        err.statusCode = 401;
        throw err
    } else {
        req.userId = decodedToken.userId;
        next();
    }
}