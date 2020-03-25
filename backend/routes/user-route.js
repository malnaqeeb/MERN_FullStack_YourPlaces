const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const bucketlistControllers = require('../controllers/bucketlist-controller');
const friendsControllers = require('../controllers/friends-controllers');

router.get("/bucketlist", bucketlistControllers.getBucketList);

router.use(checkAuth);
router.patch("/bucketlist/:pid", bucketlistControllers.addToBucketList);
router.put("/bucketlist/:pid", bucketlistControllers.visitedPlace);
router.delete("/bucketlist/:pid", bucketlistControllers.deleteFromBucketList);

router.get('/friends', friendsControllers.getFriends);
router.post('/friends', friendsControllers.createFriendRequest);
// router.get('/friends/requests', friendsControllers.getFriendRequests);
// router.put('/friends/requests', friendsControllers.acceptFriendRequest);
// router.delete('/friends/requests', friendsControllers.rejectFriendRequest);

module.exports = router;


// // create a new friend request(need user id inside body)
// router.post('/', async (req, res, next) => {
//   try {
//     await checkExistingRequest(req, res, next);
//     await createFriendRequest(req, res, next);
//   } catch (error) {
//     console.log({ error })
//     return next(error);
//   }
// });

// // Get friend requests of a user
// router.get('/requests', async (req, res, next) => {
//   const { userId } = req.userData;
//   try {
//     let friendRequests = await getFriendRequestsForUser(userId);
//     res.status(200).json({ friendRequests });
//   } catch (error) {
//     console.log({ error })
//     return next(error);
//   }
// });

// // Accepts friend request
// router.get('/requests/:requestId/accept', async (req, res, next) => {
//   const { requestId } = req.params;
//   const { userId } = req.userData;
//   try {
//     // Check if there is a request
//     const requestInfo = await checkRequestById(userId, requestId);
//     // If there is one, remove it from both users friendRequests arrays (filter and set)
//     if (requestInfo.isRequestFound) {
//       await removeFriendRequest(requestInfo);
//     }
//     // Add both users to each others friends arrays (addToSet)
//     if (!requestInfo.isAlreadyFriend) {
//       await makeFriendshipFromRequest(requestInfo)
//     }
//     // return a success message
//     res.status(200).json({ message: 'Friend request has been approved successfully!' });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// });

// // Rejects friend request
// router.get('/requests/:requestId/cancel', async (req, res, next) => {
//   const { requestId } = req.params;
//   const { userId } = req.userData;
//   try {
//     // Check if there is a request
//     const requestInfo = await checkRequestById(userId, requestId);
//     // If there is one, remove it from both users friendRequests arrays (filter and set)
//     if (requestInfo.isRequestFound) {
//       await removeFriendRequest(requestInfo);
//     }
//     // return a success message
//     res.status(200).json({ message: 'Friend request has been declined successfully!' });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// });

// module.exports = router;
