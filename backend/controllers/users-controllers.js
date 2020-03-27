const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../model/user");
const HttpError = require("../model/http-error");
const {
  forgetPasswordEmail,
  resetPasswordEmail
} = require("../emails/account");

const JWT_KEY = process.env.JWT_KEY;

const getUserFriend = async (req, res, next) => {
  const user = await User.findById(req.userData.userId)
    .populate({ path: "friends", model: User })
    .populate({ path: "friendRequests.user", model: User });

  res.status(201).json({
    userId: req.userData.userId,
    email: user.email,
    image: user.image,
    name: user.name,
    friends: !user.friends
      ? []
      : user.friends.toObject().map(friend => ({
          id: friend._id,
          name: friend.name,
          email: friend.email,
          image: friend.image
        })),
    friendRequests: !user.friendRequests
      ? []
      : user.friendRequests.toObject().map(request => ({
          ...request,
          user: {
            id: request.user._id,
            email: request.user.email,
            image: request.user.image,
            name: request.user.name
          }
        }))
  });
};

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }
  res
    .status(200)
    .json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(
      new Error("Invalid input passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let createdUser;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return next(
        new HttpError("User exists already, please login instead.", 422)
      );
    }

    createdUser = new User({
      name,
      email,
      image: req.file.url,
      password,
      social: {},
      places: []
    });

    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError("Signin up  failed, please try again later.", 500)
    );
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, token },
      JWT_KEY,
      {
        expiresIn: "1h"
      }
    );
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later", 500)
    );
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findByCredentials(email, password);
  } catch (error) {
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, token },
      JWT_KEY,
      {
        expiresIn: "1h"
      }
    );
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try agein later", 500)
    );
  }
  res
    .status(201)
    .json({ userId: existingUser.id, email: existingUser.email, token });
};

const signJwt = async (req, res, next) => {
  let token;
  try {
    token = jwt.sign({ userId: req.user._id, email: req.user.email }, JWT_KEY, {
      expiresIn: "1h"
    });
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later", 500)
    );
  }
  res
    .status(201)
    .redirect(
      `${process.env.AUTH_REDIRECT_PATH}/social?userId=${req.user._id}&token=${token}`
    );
};

const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId, "name image notifications");
  } catch (error) {
    return next(
      new HttpError("Failed to get the user, please try again later.", 500)
    );
  }
  res.status(201).json({ user });
};

const updateUser = async (req, res, next) => {
  let user;

  if (req.params.userId !== req.userData.userId) {
    return next(new HttpError("Not authorized.", 401));
  }

  try {
    user = await User.findById(req.params.userId);
    user.name = req.body.name || user.name;
    user.image = req.file.url || user.image;
    await user.save();
  } catch {
    return next(
      new HttpError("Updating user failed, please try again later.", 500)
    );
  }
  res.status(200).json({ user: { name: user.name, image: user.image, notifications:user.notifications } });
};

const forgetPassword = async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  try {
    if (!user) {
      return next(
        new HttpError(
          `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`,
          401
        )
      );
    }
    //Generate and set password reset token
    user.generatePasswordReset();
    // Save the updated user object
    user.save();
    // send email
    let link = req.headers.origin + "/resetpassword/" + user.resetPasswordToken;

    forgetPasswordEmail(user.name, user.email, link);
    res.status(200).json({
      message: "A reset email has been sent to " + user.email + "."
    });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};


const resetPassword = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  try {
    if (!user) {
      return next(
        new HttpError("Password reset token is invalid or has expired.", 401)
      );
    }
    if (req.body.password !== req.body.confirmpassword)
      return next(
        new HttpError(
          "The password and confirmation password do not match.",
          400
        )
      );

    //Set the new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Save
    user.save();
    // send email
    resetPasswordEmail(user.name, user.email);
    res.status(200).json({ message: "Your password has been updated." });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const setNotifications = async (req, res, next) => {
  const userId = req.userData.userId;
  try {
    const user = await User.findById(userId);
    user.notifications = !user.notifications;
    await user.save();
  } catch (error) {
    return next(error);
  }
  res
    .status(200)
    .json({ message: "Your notification preference has been updated." });
};

module.exports = {
  getUsers,
  signup,
  login,
  getUser,
  updateUser,
  signJwt,
  getUserFriend,
  forgetPassword,
  resetPassword,
  setNotifications
};
