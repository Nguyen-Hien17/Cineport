const router = require('express').Router();
const signup = require('../controllers/signupController');

router.get('/', signup.index);

router.post('/', signup.signup);

module.exports = router;