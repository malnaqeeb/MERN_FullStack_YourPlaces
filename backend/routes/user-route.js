const express = require('express');
const route = express.Router();

const { check } = require('express-validator');

const checkAuth = require("../middleware/check-auth");
const messageController = require("../controllers/message-controller");

route.use(checkAuth);

route.get("/messages", 
  messageController.getUserCorresponders);

route.get("/messages/:corresponderId", 
  messageController.getMessagesFromCorresponder);

route.post("/messages/:corresponderId",
  [check('message').not().isEmpty()],
  messageController.sendMessageToCorresponder);

route.delete("/messages/:corresponderId", 
  messageController.deleteAllToCorresponder);

route.delete("/messages/:corresponderId/:messageId", 
  messageController.deleteMessagetoCorresponderById);

module.exports = route;