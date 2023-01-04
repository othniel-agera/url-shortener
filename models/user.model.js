const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  urlLimit: {
    type: Number,
    default: process.env.GLOBAL_URL_LIMIT,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('user', UserSchema);
