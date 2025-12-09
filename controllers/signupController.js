const signupService = require('../services/signupService');

exports.index = async (req, res) => {
    res.render('signup');
}

exports.signup = async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    let validateUsername = signupService.validateUsername(username);
    let validateEmail = signupService.validateEmail(email);

    const [validateUsernameRes, validateEmailRes] = await Promise.all([validateUsername, validateEmail]);
    if (validateUsernameRes) {
        return res.status(401).send({ message: 'username exists.' });
    }
    if (validateEmailRes) {
        return res.status(401).send({ message: 'email exists.' });
    }

    await signupService.registerUser(username,email,password);

    res.send("registered successfully. login now");

}