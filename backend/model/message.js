const mongoose = require("mongoose");

const thisSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  corresponder: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  hasNewMessage: {
    type: Boolean,
    default: false
  },
  messages: [
    {
      message: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Message", thisSchema);
