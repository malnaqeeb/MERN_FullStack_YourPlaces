const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

const checkAndCreateUser = async (accessToken, refreshToken, profile, done, account) => {

  const {
    id: socialId,
    displayName: name,
    emails: [{ value: email }],
    photos: [{ value: image }],
  } = profile;

  try {
    //  if user exists
    let user = await User.findOne({ email });

    //if user does not exist create and save user
    if (!user) {
      const password = name + socialId; // Password is required

    
      user = new User({
        name,
        email,
        password,
        image,
        social: {
          [account]: socialId,
        },
        places: [],
      });
    }

    await user.save().then(() => {
      console.log(user);
    });


    let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email, token }, jwtKey, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Logging in failed, please try again later', 500));
  }
  res.status(201).json({ userId: user.id, email: user.email, token });
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('google.clientId'),
      clientSecret: config.get('google.secret'),
      callbackURL: '/api/users/google/redirect',
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done, 'google'),
  ),
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.get('facebook.clientId'),
      clientSecret: config.get('facebook.secret'),
      callbackURL: '/api/users/facebook/redirect',
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done, 'facebook'),
  ),
)
