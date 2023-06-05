const express = require('express');
const authController = require('../controller/authController');
const complainController = require('../controller/complainController');
const userController = require('../controller/userController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, complainController.activeComplains);

router
    .route('/allResolvedComplains')
    .get(authController.protect, complainController.allResolvedComplains);

router
    .route('/createComplain')
    .post(authController.protect, complainController.createComplain);
router
    .route('/createComplainMobile')
    .post(authController.protect, complainController.createComplainMobile);

router
    .route('/complainByMe')
    .get(authController.protect, complainController.getByMeComplains);

router
    .route('/complainByMeClosed')
    .get(authController.protect, complainController.getByMeComplainsClosed);

router
    .route('/complainAgainstMe')
    .get(authController.protect, complainController.getAgainstMeComplains);

router
    .route('/complainAgainstMeClosed')
    .get(authController.protect, complainController.getAgainstMeComplainsClosed);
router
    .route('/editMyComplain/:id')
    .patch(authController.protect, complainController.editMyComplain);

router
    .route('/comment/:id')
    .patch(authController.protect, complainController.createComment);

router
    .route('/createComplainMobile')
    .post(authController.protect, complainController.createComplainMobile);

module.exports = router;