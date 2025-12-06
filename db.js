const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@sepm.faut6or.mongodb.net/Cineport?retryWrites=true&w=majority`);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected successfully');
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

module.exports = mongoose;