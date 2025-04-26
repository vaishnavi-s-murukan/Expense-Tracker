const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/getUser', authenticate, getUser);

module.exports = router;
