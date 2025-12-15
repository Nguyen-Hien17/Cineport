const router = require('express').Router();
const account = require('../controllers/accountController');

router.get('/:id', account.index);

module.exports = router;