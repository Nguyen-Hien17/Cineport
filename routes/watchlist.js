const router = require('express').Router();
const watchlist = require('../controllers/watchlistController');
const isLoggedIn = require('../middleware/auth');

router.get('/', isLoggedIn, watchlist.index);

module.exports = router;