const { User } = require('../models/user');
const bcrypt = require('bcrypt');

exports.validateUsername = async (username) => {
    const user = await User.findOne({ userName: username });

    if (user) {
        return true;
    }

    return false;
};

exports.validateEmail = async (email) => {
    const user = await User.findOne({ email: email });

    if (user) {
        return true;
    }

    return false;
};

exports.registerUser = async (username, email, passwd) => {
    let user = new User({
        userName: username,
        email: email,
        password: bcrypt.hashSync(passwd, 10),
        watchlist: []
    });

    user.save();
};
