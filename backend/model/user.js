const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const HttpError = require('../model/http-error');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const { ObjectId} = mongoose.Schema.Types;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  verifyAccountToken: String, 
  verifyAccountExpires: Date,
  active: { type: Boolean, default: false },
  image: {
    type: String,
  },
  social: {
    google: { type: String, default: null },
    facebook: { type: String, default: null },
  },
  places: [
    {
      type: mongoose.Types.ObjectId,
      required: true,

      ref: 'Place',
    },
  ],
  placesCount: { type: Number, default: 0 },
  friends: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  friendRequests: [
    {
      user: { type: ObjectId, ref: 'User' },
      date: Date,
      isSent: Boolean,
    },
  ],
  bucketList: [
    {
      id: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' },
      _id: false,
      createdBy: {type: String},
      isVisited: {type: Boolean}
    }
  ],
  resetPasswordToken: String, // used for after password reset is submitted
  resetPasswordExpires: Date,
  notifications: {type:Boolean, default:true},
  created_at: { type: Date, required: true, default: Date.now },

});
// I created my own method to handle the login process
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError('Invalid credentials, could not log you in.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError('Invalid credentials, could not log you in.', 401);
  }
  return user;
};

userSchema.pre('save', function(next) {
  this.placesCount = this.places.length;
  next();
});

// Hash the plain text password before saveing
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});
userSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

userSchema.methods.generateAccountVerify = function() {
  this.verifyAccountToken = crypto.randomBytes(20).toString("hex");
  this.verifyAccountExpires = Date.now() + 3600000; 
};
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
