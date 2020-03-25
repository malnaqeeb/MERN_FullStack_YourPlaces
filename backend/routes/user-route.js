const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const bucketlistControllers = require('../controllers/bucketlist-controller');
const friendsControllers = require('../controllers/friends-controllers');

router.get('/bucketlist', bucketlistControllers.getBucketList);

router.use(checkAuth);
router.patch('/bucketlist/:pid', bucketlistControllers.addToBucketList);
router.put('/bucketlist/:pid', bucketlistControllers.visitedPlace);
router.delete('/bucketlist/:pid', bucketlistControllers.deleteFromBucketList);

router.get('/friends', friendsControllers.getFriends);
router.post('/friends', friendsControllers.createFriendRequest);
router.get('/friends/requests', friendsControllers.getFriendRequests);
router.put('/friends/requests/:requestId', friendsControllers.acceptFriendRequest);
router.delete('/friends/requests/:requestId', friendsControllers.rejectFriendRequest);

module.exports = router;