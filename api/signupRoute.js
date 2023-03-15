const express = require('express');
const signupController = require('../controller/signupController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').post(signupController.signup);
router.route('/second').patch(authController.protect, signupController.second);
router.route('/:email').get(signupController.checkEmail);
router
  .route('/registerAccountSys')
  .post(authController.protect, signupController.registerAccountSys);

module.exports = router;
