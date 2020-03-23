const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const HttpError = require('../model/http-error');
const User = require('../model/user');
const Message = require('../model/message');
const config = require('config');
const jwtKey = config.get('JWT_KEY');
var cloudinary = require('../uploads/cloudinary');

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

    return next(
      new HttpError(`${error}`, 500)
    );

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
    return next(
      new HttpError("Fetching user failed, please try again later.", 500)
    );
  }
  res
    .status(200)
    .json({ user: user.toObject({ getters: true })});
};

const updateUser = async (req, res, next) => {
  let user;
  let url;

  if(req.params.userId !== req.userData.userId){
    return next(
      new HttpError("Not authorized.", 401)
    );
  }

  if(req.file){
    try{
      const result = await cloudinary.uploader.upload(req.file.path);
      url = result.url;
    } catch {
      return next(
        new HttpError("Updating user failed, please try again later.", 500)
      );
    }
  }

  try {
    user = await User.findById(req.params.userId);
    user.name = req.body.name || user.name;
    user.image = url || user.image;
    await user.save();
  } catch {
    return next(
      new HttpError("Updating user failed, please try again later.", 500)
    );
  }
  res
    .status(200)
    .json({ user: {name: user.name, image: user.image}});
};

const getUserCorresponders = async (req, res, next) => {
  let corresponders;
  try {
    corresponders = await Message.find({owner: req.userData.userId}, 'corresponder hasNewMessage')
    .populate({
      path: 'corresponder',
      select: 'name image'
    }).exec();
    res.json({corresponders});
  } catch (error) {
    return next(new HttpError('Failed to get MessageList, please try again later', 500));
  }
};

const getMessagesFromCorresponder = async (req, res, next) => {
  let messages;
  try {
    messages = await Message.find({owner: req.userData.userId, corresponder: req.params.corresponderId}).exec();
    res.json({messages});
  } catch (error) {
    return next(new HttpError('Failed to get Messages, please try again later', 500));
  }
};

const sendMessageToCorresponder = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()){
    return next(new Error('Invalid input passed, please check your data.', 422));
  }
    
  try {
    const message = await Message.updateOne(
      {owner: req.userData.userId, corresponder: req.params.corresponderId},
      {$push: {messages: req.body.message}, $set: {hasNewMessage: true}},
      {upsert: true}
    ).exec();
    await Message.updateOne(
      {owner: req.params.corresponderId, corresponder: req.userData.userId},
      {$push: {messages: req.body.message}, $set: {hasNewMessage: true}},
      {upsert: true}
    ).exec();
    res.json(message);
  } catch (error) {
    return next(new HttpError('Failed to send message, please try again later.', 500));
  }
};

const deleteAllToCorresponder = async (req, res, next) => {
  try {
    await Message.remove(
      {owner: req.userData.userId, corresponder: req.params.corresponderId}
    ).exec();
    res.json({message: "Removed"});
  } catch (error) {
    return next(new HttpError('Failed to remove corresponder, please try again later.', 500));
  }
};

const deleteMessagetoCorresponderById = async (req, res, next) => {
  try {
    await Message.updateOne(
      {owner: req.userData.userId, corresponder: req.params.corresponderId},
      {$pull: {messages: {_id: req.params.messageId}}}
    ).exec();
    res.json({message: "Removed"});
  } catch (error) {
    return next(new HttpError('Failed to remove message, please try again later.', 500));
  }
};

module.exports = { 
  getUsers, 
  signup, 
  login, 
  getUser, 
  updateUser, 
  signJwt, 
  getUserCorresponders, 
  getMessagesFromCorresponder, 
  sendMessageToCorresponder, 
  deleteAllToCorresponder,
  deleteMessagetoCorresponderById 
};
