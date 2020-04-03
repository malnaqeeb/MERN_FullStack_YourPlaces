const bcrypt = require('bcryptjs');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../model/user');

const findOrCreateUser = async (accessToken, refreshToken, profile, done, account) => {
  const {
    id: socialId,
    displayName: name,
    emails: [{value: email}],
    photos: [{value: image}]
  } = profile;

  let user;
  try {
    user = await User.findOne({email});
  } catch (error) {
    return done(error);
  }

  try {
    if (!user) {
      const password = name + socialId + Date.now(); // Password is required
      const hashedPassword = await bcrypt.hash(password, 12); // Encrypt password

      user = new User({
        name,
        email,
        image,
        password: hashedPassword,
        social: {
          [account]: socialId
        },
        places: []
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
      clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      callbackURL: '/api/users/google/redirect'
    },
    (accessToken, refreshToken, profile, done) =>
      findOrCreateUser(accessToken, refreshToken, profile, done, 'google')
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.AUTH_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      callbackURL: '/api/users/facebook/redirect',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, done) =>
      findOrCreateUser(accessToken, refreshToken, profile, done, 'facebook')
  )
);
