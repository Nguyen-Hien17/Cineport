const mongoose = require("../db");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: [String]
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}