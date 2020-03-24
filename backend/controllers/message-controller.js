const Message = require('../model/message');

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
  getUserCorresponders, 
  getMessagesFromCorresponder, 
  sendMessageToCorresponder, 
  deleteAllToCorresponder,
  deleteMessagetoCorresponderById 
};
