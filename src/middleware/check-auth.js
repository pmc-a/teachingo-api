const jwt = require('jsonwebtoken');

function checkAuth(userToken) {
    try {
        return jwt.verify(userToken, process.env.JWT_KEY);
    } catch (error) {
        console.error(error);
        return null;
    }
}

function verifyToken(req, res, next) {
    try {
        checkAuth(req.body.userToken) !== null
            ? next()
            : res.status(401).json('User is unauthorized. Please log in.');
    } catch (err) {
        console.error(err);
        res.status(401).json('User is unauthorized. Please log in.');
    }
}

module.exports = {
    verifyToken,
};