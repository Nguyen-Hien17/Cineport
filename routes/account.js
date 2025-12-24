const router = require('express').Router();
const account = require('../controllers/accountController');

router.get('/:id', account.index);

router.get('/:id/export', account.export);

module.exports = router;