const router = require('express').Router();
const info = require('../controllers/infoController');

router.get('/:imdb_id', info.index);

module.exports = router;