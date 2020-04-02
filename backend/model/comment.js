const mongoose = require('mongoose');

const thisSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Place"
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: { 
    type: String,
    required: true
  },
  comment: { 
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
    
  }
});

module.exports = mongoose.model('Comment', thisSchema);
