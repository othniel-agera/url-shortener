const mongoose = require('mongoose');

const { Schema } = mongoose;

const URLSchema = new Schema({
  urlId: {
    type: String,
    required: true,
  },
  originalURL: {
    type: String,
    required: true,
  },
  shortenedURL: {
    type: String,
    required: true,
    unique: true,
  },
  visitCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('url', URLSchema);
