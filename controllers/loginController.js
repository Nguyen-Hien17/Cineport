const loginService = require('../services/loginService');

exports.index = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    let emailInput = req.body.email;
    let passwordInput = req.body.password;

    let user = await loginService.authenticateUser(emailInput, passwordInput);

    if (user) {
        req.session.userId = user._id;
        const userObj = user.toObject();
        delete userObj.password;
        req.session.user = userObj;
        req.session.region =
            user.region ||
            req.body.region ||
            req.query.region ||
            'US';
        console.log('User logged in with region:', req.session.region);
        res.redirect('/');
    } else {
        return res.status(401).send({ message: 'Invalid credentials.' });
    }

}

exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
}