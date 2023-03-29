const mongoose = require('mongoose');
const user = require('./user-model');

const complainHistorySchema = new mongoose.Schema({
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
  faulty: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  version: {
    type: Number,
  },
});

const ComplainHistory = mongoose.model(
  'ComplainHistory',
  complainHistorySchema
);

module.exports = ComplainHistory;
