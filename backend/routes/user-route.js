const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const bucketlistControllers = require('../controllers/bucketlist-controller');
const friendsControllers = require('../controllers/friends-controllers');
const messageController = require("../controllers/message-controller");

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

router.get("/messages", 
  messageController.getUserCorresponders);

router.get("/messages/:corresponderId", 
  messageController.getMessagesFromCorresponder);

router.post("/messages/:corresponderId",
  [check('message').not().isEmpty()],
  messageController.sendMessageToCorresponder);

router.delete("/messages/:corresponderId", 
  messageController.deleteAllToCorresponder);

router.delete("/messages/:corresponderId/:messageId", 
  messageController.deleteMessagetoCorresponderById);

module.exports = router;