const router = require('express').Router();
const watchlist = require('../controllers/watchlistController');
const isLoggedIn = require('../middleware/auth');

router.get('/', isLoggedIn, watchlist.index);

router.get('/add', watchlist.add);

module.exports = router;