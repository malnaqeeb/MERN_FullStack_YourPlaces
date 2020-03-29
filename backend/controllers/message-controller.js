const { validationResult } = require("express-validator");

const HttpError = require("../model/http-error");
const Message = require("../model/message");

const getUserCorresponders = async (req, res, next) => {
  let corresponders;
  try {
    corresponders = await Message.find(
      { owner: req.userData.userId },
      "corresponder hasNewMessage -_id",
    )
      .populate({
        path: "corresponder",
        select: "name image",
      }).sort("-updatedAt").exec();
    res.json({ corresponders });
  } catch (error) {
    return next(new HttpError("Failed to get MessageList, please try again later", 500));
  }
};

const getMessagesFromCorresponder = async (req, res, next) => {
  let messages;
  try {
    messages = await Message.findOneAndUpdate(
      { owner: req.userData.userId, corresponder: req.params.corresponderId },
      { $set: { hasNewMessage: false } },
      { new: true, upsert: true },
    ).exec();
    res.json({ messages: messages.messages || [] });
  } catch (error) {
    return next(new HttpError("Failed to get Messages, please try again later", 500));
  }
};

const sendMessageToCorresponder = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new Error("Invalid input passed, please check your data.", 422));
  }
  const messageId = Message.createNewMessageId();
  try {
    await Message.findOneAndUpdate(
      { owner: req.userData.userId, corresponder: req.params.corresponderId },
      {
        $push: { messages: { _id: messageId, message: req.body.message, isSent: true } },
        $set: { hasNewMessage: true },
      },
      { upsert: true },
    ).exec();
    await Message.updateOne(
      { owner: req.params.corresponderId, corresponder: req.userData.userId },
      {
        $push: { messages: { message: req.body.message } },
        $set: { hasNewMessage: true },
      },
      { upsert: true },
    ).exec();
    res.json({ messageId });
  } catch (error) {
    return next(new HttpError("Failed to send message, please try again later.", 500));
  }
};

const deleteAllToCorresponder = async (req, res, next) => {
  try {
    await Message.deleteOne({
      owner: req.userData.userId,
      corresponder: req.params.corresponderId,
    }).exec();
    res.json({ message: "Removed" });
  } catch (error) {
    return next(new HttpError("Failed to remove corresponder, please try again later.", 500));
  }
};

const deleteMessagetoCorresponderById = async (req, res, next) => {
  try {
    await Message.updateOne(
      { owner: req.userData.userId, corresponder: req.params.corresponderId },
      { $pull: { messages: { _id: req.params.messageId } } },
    ).exec();
    res.json({ message: "Removed" });
  } catch (error) {
    return next(new HttpError("Failed to remove message, please try again later.", 500));
  }
};

module.exports = {
  getUserCorresponders,
  getMessagesFromCorresponder,
  sendMessageToCorresponder,
  deleteAllToCorresponder,
  deleteMessagetoCorresponderById,
};
