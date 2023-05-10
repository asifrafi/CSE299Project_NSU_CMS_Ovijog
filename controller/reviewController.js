const uuid = require('uuid').v4;

const catchAsync = require('../utilsServer/catchAsync');
const AppError = require('../utilsServer/appError');
const ComplainModel = require('../models/complain-model');
const User = require('../models/user-model');
const complaintEmail = require('../utilsServer/complainEmail');
const {
  complainCloseEmail,
  reviewerChangeEmail,
} = require('../utilsServer/reviewEmail');

exports.myReviewComplains = catchAsync(async (req, res, next) => {
  const complains = await ComplainModel.find({
    reviewer: req.userID,
    status: 'Open',
  })
    .populate('complainer')
    .populate('faulty')
    .populate('reviewer')
    .populate('comments.commenter')
    .populate('versions.editor')
    .populate('versions._id');

  res.status(200).json({
    status: 'success',
    complains,
  });
});

exports.myReviewComplainsClosed = catchAsync(async (req, res, next) => {
  const a = 'Close';

  const complains = await ComplainModel.find({
    reviewer: req.userID,
    status: 'Close',
  })
    .populate('complainer')
    .populate('faulty')
    .populate('reviewer')
    .populate('comments.commenter')
    .populate('versions.editor')
    .populate('versions._id')
    .populate('statusCloser');

  res.status(200).json({
    status: 'success',
    complains,
  });
});

exports.closeComplain = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { user, comment } = req.body;

  const closer = await User.findById(user._id);

  if (!closer) return res.status(401).json('Closer does not exist');

  if (comment.length < 1)
    return res
      .status(401)
      .json('In order to close a complain, there must be a closing comment.');

  const complain = await ComplainModel.findByIdAndUpdate(id, {
    status: 'Close',
    statusComment: comment,
    statusCloser: user._id,
    statusDate: Date.now(),
  });

  await complainCloseEmail(complain._id);

  res.status(201).json({
    status: 'success',
    complain,
  });
});

exports.reviewerChange = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { user, reviewer } = req.body;

  const changer = await User.findById(user._id);

  if (!changer) return res.status(401).json('Changer does not exist');

  let complain = await ComplainModel.findById(id).populate('reviewer');

  console.log(user.RFID, complain.reviewer.RFID);

  if (
    user.RFID !== complain.reviewer.RFID &&
    user.typeOfUser !== 'System-Admin'
  )
    return res
      .status(401)
      .json("User doesn't have the permission to change review");

  complain = await ComplainModel.findByIdAndUpdate(id, {
    reviewer: reviewer,
  });

  await reviewerChangeEmail(complain._id);

  res.status(201).json({
    status: 'success',
    complain,
  });
});
