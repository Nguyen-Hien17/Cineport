const express = require('express');
const session = require('express-session');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const mongoose = require('./db');

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'YOUR_VERY_STRONG_SESSION_SECRET',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/login', require('./routes/login'));

app.use('/watchlist', require('./routes/watchlist'));

app.use('/info', require('./routes/info'));

// Sidebar debug route
app.get ('/sidebar', (req, res) => {
  res.render('sidebar');
});

app.get ('/search', (req, res) => {
  res.render('search');
});

app.get ('/home', (req, res) => {
  res.render('home');
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
