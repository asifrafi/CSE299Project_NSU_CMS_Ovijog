const catchAsync = require('../utilsServer/catchAsync');
const AppError = require('../utilsServer/appError');
const ComplainModel = require('../models/complain-model');
const User = require('../models/user-model');
const ComplainHistoryModel = require('../models/complain-model-history');
const complaintCreationEmail = require('../utilsServer/complainEmail');
const uuid = require('uuid').v4;

exports.activeComplains = async (req, res, next) => {
  const complains = await ComplainModel.find({
    status: 'Open',
  })
    .populate('complainer')
    .populate('faulty')
    .populate('reviewer')
    .populate('comments.commenter')
    .populate('versions.editor')
    .populate('versions._id');

  //console.log(complains);

  res.status(200).json({
    status: 'success',
    complains,
  });
};

exports.allResolvedComplains = async (req, res, next) => {
  const complains = await ComplainModel.find({
    status: 'Close',
  })
    .populate('complainer')
    .populate('faulty')
    .populate('reviewer')
    .populate('comments.commenter')
    .populate('versions.editor')
    .populate('versions._id')
    .populate('statusCloser');

  //console.log(complains);

  res.status(200).json({
    status: 'success',
    complains,
  });
};

exports.createComplain = catchAsync(async (req, res, next) => {
  const { complainer, faulty, reviewer, title, complaintext } =
    req.body.complain;

  //checking whether the faulty and reviewer same paerson
  if (faulty === reviewer) {
    return next(
      res.status(400).json("Faulty and Reviewer can't ne the same person")
    );
  }

  //checking whether the complainer is faulty or reviewer
  if (complainer === faulty || complainer === reviewer) {
    return next(res.status(400).json("Complainer can't be faulty or reviewer"));
  }

  //checking whether the reviewer is a Faculty or Admin-Staff
  const faultyData = await User.findById(faulty);
  const reviewerData = await User.findById(reviewer);

  if (
    reviewerData.typeOfUser !== 'Faculty' &&
    reviewerData.typeOfUser !== 'Admin-Staff'
  ) {
    return next(
      res.status(400).json('Reviewer must be a Faculty or an Admin-Staff')
    );
  }

  try {
    let doc = await ComplainModel.create({
      title,
      complain: complaintext,
      evidence: req.body.evidence,
      complainer,
      faulty,
      reviewer,
    });

    await complaintCreationEmail.complaintCreationEmail(doc._id);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  } catch (error) {
    return next(res.status(500).json('Server Error'));
  }
});
// rest of the feature will be implemented from here