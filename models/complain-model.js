const mongoose = require('mongoose');
const User = require('./user-model');

const complainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    complain: {
      type: String,
    },
    evidence: {
      type: Array,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    complainer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    faulty: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        _id: { type: String },
        commenter: { type: mongoose.Schema.ObjectId, ref: 'User' },
        text: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    versions: [
      {
        _id: { type: mongoose.Schema.ObjectId, ref: 'ComplainHistory' },
        editor: { type: mongoose.Schema.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
      },
    ],
    versionNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Complain = mongoose.model('Complain', complainSchema);

module.exports = Complain;
