const router = require('express').Router();
const { register, login, logout, index, profile } = require('../controllers/UserController');


router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/', index);
router.get('/profile', profile);


module.exports = router;

