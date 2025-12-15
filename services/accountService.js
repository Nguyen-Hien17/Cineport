const { User } = require('../models/user');

exports.getAccountDetails = async (id) => {
    const user = await User.findOne({ _id: id });
    
    return user;
}