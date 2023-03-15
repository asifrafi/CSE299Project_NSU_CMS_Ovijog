const catchAsync = require('../utilsServer/catchAsync');
const AppError = require('../utilsServer/appError');
const authController = require('./authController');
const User = require('../models/user-model');

exports.all = catchAsync(async (req, res, next) => {
  try {
    //console.log(req.userID);
    const user = await User.find();

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Server error`);
  }
});

exports.viewMe = catchAsync(async (req, res, next) => {
  try {
    //console.log(req.userID);
    const user = await User.findById(req.userID);

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Server error`);
  }
});

exports.anUser = catchAsync(async (req, res, next) => {
  const { searchText } = req.params;

  try {
    let userPattern = new RegExp(`^${searchText}`);

    const results = await User.find({
      name: { $regex: userPattern, $options: 'i' },
      typeOfUser: { $ne: 'System-Admin' },
    });

    //console.log(results);

    res.json(results);
  } catch (error) {
    return res.status(500).json('Server Error');
  }
});

exports.anReviewer = catchAsync(async (req, res, next) => {
  const { searchText } = req.params;
  console.log(searchText);

  try {
    let userPattern = new RegExp(`^${searchText}`);

    const results = await User.find({
      name: { $regex: userPattern, $options: 'i' },
      $or: [{ typeOfUser: 'Faculty' }, { typeOfUser: 'Admin-Staff' }],
    });

    //console.log(results);

    res.json(results);
  } catch (error) {
    return res.status(500).json('Server Error');
  }
});
