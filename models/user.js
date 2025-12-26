const { name } = require("ejs");
const mongoose = require("../db");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: [{
        titleId: { type: String },
        status: { type: String, enum: ['watching', 'completed', 'dropped', 'plan_to_watch'] },
        episodesWatched: { type: String },
    }],
    addOn: [{
        service: { type: String },
        isEnabled: { type: Boolean, default: true }
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}