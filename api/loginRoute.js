const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').post(authController.login);

router.route('/loginmobile').post(authController.loginMobile);

module.exports = router;