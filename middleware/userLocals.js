// middleware/userLocals.js
module.exports = (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.userId = req.session.userId || null;
    next();
};
