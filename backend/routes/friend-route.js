const express = require('express')
// Authorization purposes -> checks the token of the user
const checkAuth = require("../middleware/check-auth");
const {
  getFriends,
  checkExistingRequest,
  createFriendRequest,
  checkRequestById,
  removeFriendRequest,
  makeFriendshipFromRequest,
  getFriendRequestsForUser
} = require('../controllers/friends-controllers');

// Router object
const router = express.Router()
// Use the authorization middleware to prevent anonymous access
router.use(checkAuth) // req.userData.userId

// get all friends from user
router.get('/', async (req, res, next) => {
  await getFriends(req, res, next);
});

// create a new friend request(need user id inside body)
router.post('/', async (req, res, next) => {
  try {
    await checkExistingRequest(req, res, next);
    await createFriendRequest(req, res, next);
  } catch (error) {
    console.log({ error })
    return next(error);
  }
});

// Get friend requests of a user
router.get('/requests', async (req, res, next) => {
  const { userId } = req.userData;
  try {
    let friendRequests = await getFriendRequestsForUser(userId);
    res.status(200).json({ friendRequests });
  } catch (error) {
    console.log({ error })
    return next(error);
  }
});

// Accepts friend request
router.get('/requests/:requestId/accept', async (req, res, next) => {
  const { requestId } = req.params;
  const { userId } = req.userData;
  try {
    // Check if there is a request
    const requestInfo = await checkRequestById(userId, requestId);
    // If there is one, remove it from both users friendRequests arrays (filter and set)
    if (requestInfo.isRequestFound) {
      await removeFriendRequest(requestInfo);
    }
    // Add both users to each others friends arrays (addToSet)
    if (!requestInfo.isAlreadyFriend) {
      await makeFriendshipFromRequest(requestInfo)
    }
    // return a success message
    res.status(200).json({ message: 'Friend request has been approved successfully!' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

// Rejects friend request
router.get('/requests/:requestId/cancel', async (req, res, next) => {
  const { requestId } = req.params;
  const { userId } = req.userData;
  try {
    // Check if there is a request
    const requestInfo = await checkRequestById(userId, requestId);
    // If there is one, remove it from both users friendRequests arrays (filter and set)
    if (requestInfo.isRequestFound) {
      await removeFriendRequest(requestInfo);
    }
    // return a success message
    res.status(200).json({ message: 'Friend request has been declined successfully!' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

module.exports = router;