const { User } = require('../models/user');
const bcrypt = require('bcrypt');

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return user;
        }
    }

    return false;
};