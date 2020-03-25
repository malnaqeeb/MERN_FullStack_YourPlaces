const mongoose = require('mongoose');
const HttpError = require('../model/http-error');
const Place = require('../model/place');
const User = require('../model/user');

const getBucketList = async (req, res, next) => {
  const userId = req.query.q;
  let userWithBucketList;
  try {
    userWithBucketList = await User.findById(userId).populate('bucketList.id');

    res.json({
      userWithBucketList: userWithBucketList.bucketList.toObject({
        getters: true
      })
    });
  } catch (error) {
    return next(
      new HttpError(
        'Something went wrong, could not find a place for the provided id.',
        500
      )
    );
  }
};

const addToBucketList = async (req, res, next) => {
  const placeId = req.params.pid;
  let placeForBucket;
  try {
    placeForBucket = await Place.findById(placeId).populate('creator');
    if (!placeForBucket) {
      return next(
        new HttpError(`Could not find a place  for the provided place id.`, 404)
      );
    }
  } catch (error) {
    return next(
      new HttpError(
        'Something went wrong, could not find a place for the provided id.',
        500
      )
    );
  }
  const userId = req.userData.userId;
  let currentUser;
  try {
    currentUser = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        'Something went wrong, could not find a user for the provided id.',
        500
      )
    );
  }

  const newBucketItem = {
    id: placeForBucket.id,
    createdBy: placeForBucket.creator.name,
    isVisited: false
  };
  const nonUniqueArray = currentUser.bucketList.filter(item => {
    return item.id == placeForBucket.id;
  });

  const checkUnique = () => {
    if (nonUniqueArray.length > 0) {
      return false;
    } else {
      return true;
    }
  };
  const isUnique = checkUnique();

  if (!isUnique) {
    const error = new Error('You cannot add the place with provided id', 401);
    return next(error);
  }

  if (placeForBucket.creator != req.userData.userId && isUnique) {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      currentUser.bucketList.push(newBucketItem);
      await currentUser.save({session: sess});
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError('Adding place failed, place try again.', 500);
      return next(error);
    }
  } else {
    const error = new Error(
      'You cannot add your own places to you bucket list',
      401
    );
    return next(error);
  }
  res.json({
    addedPlace: placeForBucket
  });
};

const visitedPlace = async (req, res, next) => {
  const userId = req.userData.userId;
  const placeId = req.params.pid;

  let currentUser;
  try {
    currentUser = await User.findById(userId);
    const currentBucket = currentUser.bucketList;
    const currentItem = currentBucket.find(item => item.id == placeId);
    currentItem.isVisited = !currentItem.isVisited;
    await currentUser.save();
  } catch (error) {
    return next(error);
  }
  res.send({message: 'Place visited'});
};

const deleteFromBucketList = async (req, res, next) => {
  const placeId = req.params.pid;
  const userId = req.userData.userId;
  if (req.userData.userId == userId) {
    try {
      currentUser = await User.findById(userId);
      await currentUser.bucketList.pull({id: placeId});
      await currentUser.save();
    } catch (error) {
      return next(new HttpError(`${error}`, 500));
    }
    res.status(200).json({message: 'place deleted from bucket list'});
  } else {
    return next(new Error('You are not authorized to delete this place', 401));
  }
};

module.exports = {
  getBucketList,
  addToBucketList,
  visitedPlace,
  deleteFromBucketList
};
