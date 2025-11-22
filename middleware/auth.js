const isLoggedIn = async (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send({ message: 'Access denied. Please log in.' });
    }
};

module.exports = isLoggedIn;