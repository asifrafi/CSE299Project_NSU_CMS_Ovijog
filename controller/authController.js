const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');
const catchAsync = require('../utilsServer/catchAsync');
const AppError = require('../utilsServer/appError');
const sendEmail = require('../utilsServer/email');

exports.login = catchAsync(async (req, res, next) => {
  //console.log(req.body.user);
  const { email, password } = req.body.user;

  //1)check if email and password exist
  if (!email || !password) {
    return res.status(400).json('Please provide Email and Password!');
  }

  try {
    //2) check if user exists && password is correct
    const user = await User.findOne({ email }).select('password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json('Incorrect Email or Password');
    }

    //3) if everything ok, send token to client
    const payload = { userId: user._id };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token);
        res.status(200).json(token);
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json('Server Error');
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  try {
    if (!req.headers.authorization) {
      return res.status(401).json(`Unauthorized`);
    } else if (req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.headers.authorization;
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.userID = userId;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json(`Unauthorized`);
  }
});
