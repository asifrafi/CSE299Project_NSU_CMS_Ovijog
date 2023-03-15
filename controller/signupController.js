const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model.js');
const catchAsync = require('../utilsServer/catchAsync');
const AppError = require('../utilsServer/appError');
const sendEmail = require('../utilsServer/email');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body.user;

  const checkEmail = email.split('@');

  if (checkEmail[1] != 'northsouth.edu')
    return res.status(401).json('Invalid Email');

  if (password.length < 6) {
    return res.status(401).json('Password must be atleast 6 character');
  }

  try {
    let user;

    user = new User({
      name,
      email: email.toLowerCase(),
      password,
    });

    await user.save();

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
    return res.status(500).json('Server error');
  }
});

exports.second = catchAsync(async (req, res, next) => {
  const { RFID, phoneNumber, typeOfUser } = req.body.user;

  const user = await User.findByIdAndUpdate(
    req.userID,
    {
      RFID,
      phoneNumber,
      typeOfUser,
      image: req.body.profilePicUrl,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.checkEmail = catchAsync(async (req, res, next) => {
  const { email } = req.params;
  console.log(email);

  try {
    if (email.length < 1) return res.status(401).json('Invalid');

    const user = await User.findOne({ email: email.toLowerCase() });
    //console.log('hey');

    if (user) return res.status(400).json('Email already taken');

    return res.status(200).json('Available');
  } catch (error) {
    return res.status(500).json('Server Error');
  }
});

exports.registerAccountSys = catchAsync(async (req, res, next) => {
  const { name, email, password, RFID, phoneNumber, typeOfUser } =
    req.body.user;

  try {
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      RFID,
      phoneNumber,
      typeOfUser,
      image: req.body.profilePicUrl,
    });

    await user.save();

    res.status(200).json('Successfully registered user');
  } catch (error) {
    return res.status(500).json("Couldn't register new user");
  }
});
