const mongoose = require('mongoose');

const { PLACE_TAGS_VALUES } = require('../util/constants');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    id: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    lng: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: { type: Array },
  disLike: { type: Array },
  created_at: { type: Date, required: true, default: Date.now },
  rate: { type: Number, required: true, default: 0 },
  tags: { type: [{ type: String, enum: PLACE_TAGS_VALUES }], default: [] },
});

placeSchema.pre('validate', function(next) {
  this.rate = this.likes.length - this.disLike.length;
  next();
});

module.exports = mongoose.model('Place', placeSchema);
