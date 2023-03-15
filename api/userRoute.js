const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.route('/').get(authController.protect, userController.all);
router.route('/me').get(authController.protect, userController.viewMe);
router.route('/:searchText').get(authController.protect, userController.anUser);
router
  .route('/reviewer/:searchText')
  .get(authController.protect, userController.anReviewer);

module.exports = router;
