const express = require('express');
const passport = require('passport');
const {check} = require('express-validator');
const route = express.Router();

const checkAuth = require('../middleware/check-auth');
const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

route.get('/', usersControllers.getUsers);
route.get('/me',checkAuth, usersControllers.getUserFriend);

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
    check('password').isLength({min: 6})
  ],
  usersControllers.signup
);
// get token after clicked the link in sent email 
route.get("/confirm/:token", usersControllers.confirmAccount);

route.post('/login', usersControllers.login);

// auth with Google+
route.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force'
  })
);

// callback route for google to redirect to
route.get('/google/redirect', passport.authenticate('google', {session: false}), (req, res) => {
  usersControllers.signJwt(req, res);
});

// auth with Facebook
route.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['email']
  })
);
// Callback route to redirect to
route.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {session: false}),
  (req, res) => {
    usersControllers.signJwt(req, res);
  }
);

route.get('/:userId', usersControllers.getUser);
route.post("/forget", usersControllers.forgetPassword);
route.post(
  "/reset/:token",
  check("password").isLength({ min: 6 }),
  usersControllers.resetPassword
);

route.use(checkAuth);

route.put("/notifications/:userId", usersControllers.setNotifications)
route.patch('/:userId',
  fileUpload.single('image'),
  usersControllers.updateUser);



module.exports = route;