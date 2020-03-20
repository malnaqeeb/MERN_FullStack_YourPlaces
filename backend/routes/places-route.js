const express = require("express");
const { check } = require("express-validator");
const route = express.Router();
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const placessControllers = require("../controllers/places-controller");
​
route.get("/:pid", placessControllers.getPlaceById);
​
route.get("/user/:uid", placessControllers.getPlacesByUserId);
route.get("/evaluation/:id", placessControllers.placeEvaluation);
​
route.use(checkAuth);
route.post(
  "/",
  fileUpload.single("image"),
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  placessControllers.createPlace
);
​
route.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placessControllers.updatePlaceById
);
route.post("/like/:id", placessControllers.likeThePlace);
route.post("/disLike/:id", placessControllers.disLikeThePlace);
​
route.delete("/like/:pid", placessControllers.deletePlaceById);
module.exports = route;