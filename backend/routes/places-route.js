const express = require('express');
const {check} = require('express-validator');
const route = express.Router();

const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const placessControllers = require('../controllers/places-controller');
const commentsControllers = require('../controllers/comments-controller');

route.get("/:pid", placessControllers.getPlaceById);
route.get("/user/:uid", placessControllers.getPlacesByUserId);
route.get('/evaluation/:id', placessControllers.placeEvaluation);

route.get("/:pid/comments", commentsControllers.getComments);

route.use(checkAuth);

route.post("/:pid/comments", 
  [check('comment').not().isEmpty(), check('title').not().isEmpty()], 
  commentsControllers.createComment);

route.patch("/:pid/comments/:cid", 
  [check('comment').not().isEmpty(), check('title').not().isEmpty()], 
  commentsControllers.updateComment);

route.delete("/:pid/comments/:cid", commentsControllers.deleteComment);

route.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({min: 5}),
    check('address')
      .not()
      .isEmpty()
  ],
  placessControllers.createPlace
);

route.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({min: 5})
  ],
  placessControllers.updatePlaceById
);
route.post('/like/:id', placessControllers.likeThePlace);
route.post('/disLike/:id', placessControllers.disLikeThePlace);

route.delete('/:pid', placessControllers.deletePlaceById);

module.exports = route;
