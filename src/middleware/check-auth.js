const jwt = require('jsonwebtoken');

module.exports = (userToken) => {
    try {
        return jwt.verify(userToken, process.env.JWT_KEY);
    } catch (error) {
        console.error(error);
        return null;
    }
};
