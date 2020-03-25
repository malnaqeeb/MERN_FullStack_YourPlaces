const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const HttpError = require('../model/http-error');
const User = require('../model/user');
const config = require('config');
const jwtKey = config.get('JWT_KEY');
const cloudinary = require('../uploads/cloudinary');

const getUserFriend = async (req, res, next) => {
   const user = await User.findById(req.userData.userId)
    .populate({ path: 'friends', model: User })
    .populate({ path: 'friendRequests.user', model: User });

  res.status(201).json({
    userId: req.userData.userId,
    email: user.email,
    image: user.image,
    name: user.name,
    friends: !user.friends
      ? []
      : user.friends
        .toObject()
        .map(friend => ({
          id: friend._id,
          name: friend.name,
          email: friend.email,
          image: friend.image
        })),
    friendRequests: !user.friendRequests
      ? []
      : user.friendRequests
        .toObject()
        .map(request => ({
          ...request,
          user: {
            id: request.user._id,
            email: request.user.email,
            image: request.user.image,
            name: request.user.name,
          }
        }))
  });
};
const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }
  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty())
    return next(new Error('Invalid input passed, please check your data.', 422));
  const { name, email, password } = req.body;
  let createdUser;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) return next(new HttpError('User exists already, please login instead.', 422));
    // upload the image first to the cloudinary than I saved the image url on mongodb
    const result = await cloudinary.uploader.upload(req.file.path);

    createdUser = new User({
      name,
      email,
      image: result.url,
      password,
      social: {},
      places: [],
    });

    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Signin up  failed, please try again later.', 500));
  }
  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email, token }, jwtKey, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again later', 500));
  }
  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
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
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email, token }, jwtKey, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Logging in failed, please try agein later', 500));
  }
  res.status(201).json({ userId: existingUser.id, email: existingUser.email, token });
};

const signJwt = async (req, res, next) => {
  console.log(req.user);
  let token;
  try {
    token = jwt.sign({ userId: req.user._id, email: req.user.email }, jwtKey, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Logging in failed, please try again later', 500));
  }
  res.status(201).redirect(`http://localhost:3000/social?userId=${req.user._id}&token=${token}`);
};


const getUser = async (req, res, next) => {
  let user;

  try {
    user = await User.findById(req.params.userId, "name image");
  } catch (error) {
    return next(new HttpError('Loggin in failed, please try agein later', 500));
  }
  res.status(201).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};



module.exports = { getUsers, signup, login, getUser, updateUser, signJwt, getUserFriend };

