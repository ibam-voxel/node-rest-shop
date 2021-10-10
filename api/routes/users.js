const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const User = require('../controllers/users');

router.get('/signup', User.get);

router.post('/signup', User.sign);

router.post('/login', User.login);

router.delete('/signup/:userId',  checkAuth, User.delete);

module.exports = router