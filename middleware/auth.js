const User = require('../models/user');

const isAuthenticated = async (req, res, next) => {
    if (req.session.userId) {
        req.user = await User.findById(req.session.userId).select('-password');
        next();
    } else {
        res.status(401).send({ message: 'Access denied. Please log in.' });
    }
};

module.exports = isAuthenticated;