const mongoose = require('mongoose');
const User = require("../model/user");
const HttpError = require("../model/http-error");

const { ObjectId } = mongoose.Types;

// If the request passes the authorization we have req.userData.userId
const getFriends = async (req, res, next) => {
  const { userId } = req.userData;
  let user;
  try {
    user = await User.findOne({ _id: userId })
      .populate({ path: 'friends', model: User }); // We get the user with friends
  } catch (err) {
    console.log({ err })
    const error = new HttpError("Fetching users failed, try again later", 500);
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

// If the request passes the authorization we have req.userData.userId
const checkExistingRequest = async (req, res, next = null) => {
  const { friendId } = req.body
  const { userId } = req.userData;
  try {
    // Get the user
    let user = await User.findOne({ _id: userId }, "-password")
      .populate({ path: 'friends', model: User })
      .populate({ path: 'friendRequests.user', model: User });
    // Check if the user is friend with the person before sending a request?
    if (user.friends && user.friends.some(friend => ObjectId(friend.id).equals(friendId))) {
      return next ? next(new HttpError('You are already friend with ' + user.name, 402)) : true;
    }
    // Check if there is an existing request before sending a request?
    if (user.friendRequests && user.friendRequests.some(request => ObjectId(request.user.id).equals(friendId))) {
      return next ? next(new HttpError('There is already a request related with ' + user.name, 402)) : true;
    }
    return false
  } catch (err) {
    console.log({ err });
    throw new HttpError("Fetching the user information failed, try again later", 500);
  }
};

// If the request passes the authorization we have req.userData.userId
const createFriendRequest = async (req, res, next) => {
  const { friendId } = req.body
  const { userId } = req.userData;
  try {
    let friend = await User.findOne({ _id: friendId }, "-password");
    if (!friend) {
      throw new HttpError("Could not find friend to sent request!", 404);
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
      { _id: userId },
      { $addToSet: { friendRequests: sentRequest } }
    );
    // Update friend data
    await User.findOneAndUpdate(
      { _id: friendId },
      { $addToSet: { friendRequests: receivedRequest } }
    );

    res.status(200).json({ message: 'Friend request created successfully!' });
  } catch (err) {
    throw new HttpError("Could not update user information, try again later", 500);
  }
};

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
    let acceptingUser = await User.findOne({ _id: acceptingUserId }, "-password")
      .populate({ path: 'friends', model: User })
      .populate({ path: 'friendRequests.user', model: User });

  

    let friendRequest = acceptingUser.friendRequests.find(request => {
      return ObjectId(request.id).equals(requestId)
    });

    response.isAlreadyFriend = acceptingUser.friends && acceptingUser.friends.some(friend => ObjectId(friend.id).equals(friendRequest.user.id));
    response.isRequestFound = friendRequest !== null;
    response.acceptingUser = acceptingUser;
    response.requestingUser = friendRequest.user;
    response.friendRequest = friendRequest;

    return response;
  } catch (error) {
    console.log({ error });
    throw new HttpError("Fetching the request information failed, try again later", 500);
  }
}

// Remove the request from the arrays
const removeFriendRequest = async (requestInfo) => {
  try {
    // Remove from the accepting users array
    await User.updateOne(
      { _id: requestInfo.acceptingUser.id },
      { $pull: { friendRequests: { _id: requestInfo.friendRequest.id } } }
    )

    // Remove from the requesting users array
    await User.updateOne(
      { _id: requestInfo.requestingUser.id },
      { $pull: { friendRequests: { user: requestInfo.acceptingUser.id } } }
    )
  } catch (error) {
    console.log({ error })
    throw new HttpError('Could not remove friend request from users information.', 500);
  }
}

// Add users as friend from a friend request
const makeFriendshipFromRequest = async (requestInfo) => {
  try {
    await User.updateOne(
      { _id: requestInfo.acceptingUser.id },
      { $addToSet: { friends: requestInfo.requestingUser } }
    )
    await User.updateOne(
      { _id: requestInfo.requestingUser.id },
      { $addToSet: { friends: requestInfo.acceptingUser } }
    )
  } catch (error) {
    console.log(error);
    throw new HttpError('Could not add users as friend.', 500);
  }
}

// Gets friend request that have sent to a user
const getFriendRequestsForUser = async userId => {
  try {
    let user = await User.findOne({ _id: userId }, "-password")
      .populate({ path: 'friendRequests.user', model: User });
    return user.friendRequests
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
      }))
  } catch (error) {
    console.log({ error });
    throw new HttpError('Could not fetch friend requests!', 500);
  }
}

module.exports = {
  getFriends,
  checkExistingRequest,
  createFriendRequest,
  checkRequestById,
  removeFriendRequest,
  makeFriendshipFromRequest,
  getFriendRequestsForUser
};