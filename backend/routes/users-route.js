const express = require('express');
const passport = require('passport');
const { check } = require('express-validator');
const route = express.Router();

const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

route.get('/', usersControllers.getUsers);

route.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersControllers.signup,
);

route.post('/login', usersControllers.login);

// auth with Google+
route.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// callback route for google to redirect to
route.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

// auth with Facebook
route.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  }),
);
// Callback route to redirect to
route.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => res.redirect('/'));

module.exports = route;
