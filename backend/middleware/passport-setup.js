const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../model/user');

const findOrCreateUser = async (accessToken, refreshToken, profile, done, account) => {
  const {
    id: socialId,
    displayName: name,
    emails: [{ value: email }],
    photos: [{ value: image }],
  } = profile;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return done(error);
  }

  try {
    if (!user) {
      const password = name + socialId; // Password is required
      const hashedPassword = await bcrypt.hash(password, 12); // Encrypt password

      user = new User({
        name,
        email,
        image,
        password: hashedPassword,
        social: {
          [account]: socialId,
        },
        places: [],
      });
      await user.save();
    }
  } catch (error) {
    return done(error);
  }

  return done(null, user);
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
      findOrCreateUser(accessToken, refreshToken, profile, done, 'google'),
  ),
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.get('facebook.clientId'),
      clientSecret: config.get('facebook.secret'),
      callbackURL: '/api/users/facebook/redirect',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    (accessToken, refreshToken, profile, done) =>
      findOrCreateUser(accessToken, refreshToken, profile, done, 'facebook'),
  ),
);
