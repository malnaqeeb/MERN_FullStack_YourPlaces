const mongoose = require('mongoose');
const User = require('../model/user');
const HttpError = require('../model/http-error');
const { friendAddedNotification, friendAcceptedNotification } = require("../emails/account");

const {ObjectId} = mongoose.Types;

// Gets the information about request
const checkRequestById = async (acceptingUserId, requestId) => {
  const response = {
    isAlreadyFriend: false,
    isRequestFound: false,
    acceptingUser: null,
    requestingUser: null,
    friendRequest: null
  };
  try {
    let acceptingUser = await User.findOne({_id: acceptingUserId}, '-password')
      .populate({path: 'friends', model: User})
      .populate({path: 'friendRequests.user', model: User});

    let friendRequest = acceptingUser.friendRequests.find(request => {
      return ObjectId(request.id).equals(requestId);
    });

    response.isAlreadyFriend = acceptingUser.friends && acceptingUser.friends.some(friend => ObjectId(friend.id).equals(friendRequest.user.id));
    response.isRequestFound = friendRequest !== null;
    response.acceptingUser = acceptingUser;
    response.requestingUser = friendRequest.user;
    response.friendRequest = friendRequest;

    return response;
  } catch (error) {
    throw new HttpError('Fetching the request information failed, try again later', 500);
  }
};

// Remove the request from the arrays
const removeFriendRequest = async (requestInfo) => {
  try {
    // Remove from the accepting users array
    await User.updateOne(
      {_id: requestInfo.acceptingUser.id},
      {$pull: {friendRequests: {_id: requestInfo.friendRequest.id}}}
    );

    // Remove from the requesting users array
    await User.updateOne(
      {_id: requestInfo.requestingUser.id},
      {$pull: {friendRequests: {user: requestInfo.acceptingUser.id}}}
    );
  } catch (error) {
    throw new HttpError('Could not remove friend request from users information.', 500);
  }
};

// Add users as friend from a friend request
const makeFriendshipFromRequest = async (requestInfo) => {
  try {
    await User.updateOne(
      {_id: requestInfo.acceptingUser.id},
      {$addToSet: {friends: requestInfo.requestingUser}}
    );
    await User.updateOne(
      {_id: requestInfo.requestingUser.id},
      {$addToSet: {friends: requestInfo.acceptingUser}}
    );
  } catch (error) {
    throw new HttpError('Could not add users as friend.', 500);
  }
};

const getFriends = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId)
      .populate({path: 'friends', model: User}); // We get the user with friends
  } catch (err) {
    const error = new HttpError('Fetching users failed, try again later', 500);
    return next(error);
  }
  res.json({
    friends: user.friends ? user.friends
      .map(friend => friend.toObject())
      .map(friend => ({
        id: friend._id,
        name: friend.name,
        email: friend.email,
        image: friend.image
      })) : []
  });
};

const createFriendRequest = async (req, res, next) => {
  const {friendId} = req.body;
  const {userId} = req.userData;
  let user
  let friend
  try {
    // Get the user
       user = await User.findOne({_id: userId}, '-password')
      .populate({path: 'friends', model: User})
      .populate({path: 'friendRequests.user', model: User});
    // Check if the user is friend with the person before sending a request?
    if (user.friends && user.friends.some(friend => ObjectId(friend.id).equals(friendId))) {
      return next ? next(new HttpError('You are already friends with ' + user.name, 402)) : true;
    }
    // Check if there is an existing request before sending a request?
    if (user.friendRequests && user.friendRequests.some(request => ObjectId(request.user.id).equals(friendId))) {
      return next ? next(new HttpError('There is already a request related with ' + user.name, 402)) : true;
    }
    // If not friends and There are no previous request.
    friend = await User.findOne({_id: friendId}, '-password');
    if (!friend) {
      throw new HttpError('Could not find friend to sent request!', 404);
    }
    const sentRequest = {
      user: ObjectId(friendId),
      date: Date(),
      isSent: true
    };
    const receivedRequest = {
      user: ObjectId(userId),
      date: sentRequest.date,
      isSent: false
    };
    // Update user data
    await User.findOneAndUpdate(
      {_id: userId},
      {$addToSet: {friendRequests: sentRequest}}
    );
    // Update friend data
    await User.findOneAndUpdate(
      {_id: friendId},
      {$addToSet: {friendRequests: receivedRequest}}
    );
    if(friend.notifications === true){
          friendAddedNotification(friend.name, user.name, friend.email)
    }

    res.status(200).json({message: 'Friend request created successfully!'});
  } catch {
    return next(new HttpError('Fetching the user information failed, try again later', 500));
  }
};

const getFriendRequests = async (req, res, next) => {
  const {userId} = req.userData;

  try {
    let user = await User.findById(userId, '-password')
      .populate({path: 'friendRequests.user', model: User});

    const friendRequests = user.friendRequests
      .toObject()
      .filter(request => request.isSent === false)
      .map(request => ({
        ...request,
        user: {
          id: request.user._id,
          name: request.user.name,
          email: request.user.email,
          image: request.user.image
        }
      }));

    res.status(200).json({friendRequests});
  } catch {
    return next(new HttpError('Could not fetch friend requests!', 500));
  }
};

const acceptFriendRequest = async (req, res, next) => {
  const {requestId} = req.params;
  const {userId} = req.userData;
  const user = await User.findById(userId)
  try {
    // Check if there is a request
    const requestInfo = await checkRequestById(userId, requestId);
    // If there is one, remove it from both users friendRequests arrays (filter and set)
    if (requestInfo.isRequestFound) {
      await removeFriendRequest(requestInfo);
    }
    // Add both users to each others friends arrays (addToSet)
    if (!requestInfo.isAlreadyFriend) {
      await makeFriendshipFromRequest(requestInfo);
      const accepting = await User.findById(requestInfo.acceptingUser.id);
      const requesting = await User.findById(requestInfo.requestingUser.id)
      if(user.notifications === true){
        friendAcceptedNotification(requesting.name, accepting.name, requesting.email)
      }
    }
    // return a success message
    res.status(200).json({message: 'Friend request has been approved successfully!'});
  } catch (error) {
    return next(error);
  }
};

const rejectFriendRequest = async (req, res, next) => {
  const {requestId} = req.params;
  const {userId} = req.userData;
  try {
    // Check if there is a request
    const requestInfo = await checkRequestById(userId, requestId);
    // If there is one, remove it from both users friendRequests arrays (filter and set)
    if (requestInfo.isRequestFound) {
      await removeFriendRequest(requestInfo);
    }
    // return a success message
    res.status(200).json({message: 'Friend request has been declined successfully!'});
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFriends,
  createFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest
};