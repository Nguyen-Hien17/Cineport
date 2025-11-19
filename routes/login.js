const router = require('express').Router();
const login = require('../controllers/loginController');

router.get('/', login.index);

router.post('/', login.login);

router.get('/logout', login.logout);

module.exports = router;