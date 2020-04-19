const jwt = require('jsonwebtoken');

const decodeToken = (userToken) => {
    try {
        return jwt.decode(userToken);
    } catch (error) {
        console.error(error);
        throw new Error('Unable to decode JWT token');
    }
};

module.exports = {
    decodeToken,
};
