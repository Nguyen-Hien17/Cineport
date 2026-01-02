const router = require('express').Router();
const account = require('../controllers/accountController');

router.get('/:id', account.index);

router.get('/:id/export', account.export);

router.get('/:id/delete', account.delete);

router.post('/:id/toggle-addon', account.toggleAddon);

module.exports = router;