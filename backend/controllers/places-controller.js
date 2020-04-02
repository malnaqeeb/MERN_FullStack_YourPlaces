const mongoose = require("mongoose");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const { likeNotification } = require("../emails/account");
const getCoordsForAddress = require("../util/location");
const Place = require("../model/place");
const User = require("../model/user");
const cloudinary = require("../uploads/cloudinary");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  try {
    const place = await Place.findById(placeId);
    if (!place)
      return next(
        new HttpError("Could not find a place for the provided id.", 404)
      );

    res.json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  const sortBy = req.query.sortBy || 'date';
  const tagFilter = req.query.tagFilter;

  let userWithPlaces;
  try {
    const populateOptions = {
      path: 'places',
      options: { collation: {locale: 'en'
    },sort: { [sortBy]: sortBy === 'title' ? '1' : '-1' } },
    };

    if (tagFilter) {
      populateOptions.match = { tags: { $in: tagFilter.split(',') } };
    }
    userWithPlaces = await User.findById(userId).populate(populateOptions);

    if (!userWithPlaces)
      return next(
        new HttpError('Could not find a place for the provided user id.', 404),
      );
    if (userWithPlaces.places.length === 0) {
      return next(
        new HttpError('There is no place with selected tag(s) .', 404),
      );
    }

    res.json({
      userWithPlaces: userWithPlaces.places.map(place =>
        place.toObject({ getters: true }),
      ),
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "Something went wrong, could not find a place for the provided id.",
        500
      )
    );
  }
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return next(
      new Error('Invalid input passed, please check your data.', 422),
    );

  const { title, description, address, tags } = req.body;
  const tagsSplitted = tags.split(',');
  // Here I change the coordinatis to object and also reverse the lng becaouse I useed the mapbox  geocode by default it geve us an array [lat, lng].
  let changeCoordinates;
  let coordinates;
  try {
    changeCoordinates = await getCoordsForAddress(address);
    coordinates = {
      lat: changeCoordinates[1],
      lng: changeCoordinates[0],
    };
  } catch (error) {
    return next(error);
  }

  const { url, public_id } = req.file;
  const imageSrc = {
    imageUrl: url,
    id: public_id,
  };
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: imageSrc,
    creator: req.userData.userId,
    tags: tagsSplitted,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  if (!user)
    return next(new HttpError("Could not find user for provided id!", 404));

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({ place: createdPlace });
  } catch (err) {
    const error = new HttpError("Create place failed, place try again.", 500);
    return next(error);
  }
};

const updatePlaceById = async (req, res, next) => {
  const { title, description, tags } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty())
    return next(
      new Error('Invalid input passed, please check your data.', 422),
    );

  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId);

    if (!place)
      return next(
        new HttpError("Could not find a place for the provided  id.", 404)
      );

    if (place.creator.toString() !== req.userData.userId) {
      return next(
        new HttpError("You are not allowed to edit this place.", 401)
      );
    }

    place.title = title;
    place.description = description;
    place.tags = tags;
    place.save();

    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update place", 500)
    );
  }
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place.", 500)
    );
  }

  if (!place)
    return next(new HttpError("Could not find a place for the id.", 404));

  if (place.creator.id !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this place.", 403)
    );
  }
  // Delete the image first from cloudinary by id
  const public_id = place.image.id;
  cloudinary.uploader.destroy(public_id, () => {});

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await User.updateMany(
      { "bucketList.id": placeId },
      { $pull: { bucketList: { id: placeId } } }
    );
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError(`${error}`, 500));
  }

  res.status(200).json({ message: "Place deleted" });
};

const likeThePlace = async (req, res, next) => {
  const placeId = req.params.id;
  const place = await Place.findById({ _id: placeId });
  const placeOwner = await User.findById(place.creator);
  const userLiked = await User.findById(req.userData.userId);  if (!place) {
    return next(new HttpError("Could not like this place!", 404));
  }

  try {
    const clicked = place.likes.includes(req.body.likes);
    const newDisLike = place.disLike.filter(user => user !== req.body.likes);

    if (clicked) {
      const newLike = place.likes.filter(user => user !== req.body.likes);
      place.likes = newLike;
      place.save();
    } else {
      place.disLike = newDisLike;
      place.likes = [...place.likes, req.body.likes];

      place.save();
    }
    if (placeOwner.notifications === true) {
      likeNotification(
        placeOwner.name,
        userLiked.name,
        place.title,
        placeOwner.email
      );
    }
    res.send({ place: place.toObject({ getters: true }) });
  } catch (error) {
    new HttpError("Something went wrong, could not like place.", 500);
  }
};

const disLikeThePlace = async (req, res, next) => {
  const placeId = req.params.id;
  const place = await Place.findById({ _id: placeId });

  if (!place) {
    return next(new HttpError("Could not dislike this place!", 404));
  }
  try {
    const disLiked = place.disLike.includes(req.body.disLike);
    const newLike = place.likes.filter(user => user !== req.body.disLike);

    if (disLiked) {
      const newDisLike = place.disLike.filter(
        user => user !== req.body.disLike,
      );
      place.disLike = newDisLike;
      place.save();
    } else {
      place.likes = newLike;
      place.disLike = [...place.disLike, req.body.disLike];
      place.save();
    }
    res.json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    new HttpError("Something went wrong, could not dislike place.", 500);
  }
};

const placeEvaluation = async (req, res, next) => {
  const placeId = req.params.id;
  try {
    const place = await Place.findById(placeId);

    if (!place)
      return next(
        new HttpError("Could not find a place for the provided id.", 404)
      );

    res.json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Somthing went wrong, could not find a place.", 500)
    );
  }
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
  likeThePlace,
  disLikeThePlace,
  placeEvaluation,
};
