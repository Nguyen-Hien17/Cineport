const router = require('express').Router();
const search = require('../controllers/searchController');

router.get('/', search.index);

module.exports = router;