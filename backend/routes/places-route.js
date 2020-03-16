const express = require("express");
const { check } = require("express-validator");
const route = express.Router();
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const placessControllers = require("../controllers/places-controller");

route.get("/:pid", placessControllers.getPlaceById);

route.get("/user/:uid", placessControllers.getPlacesByUserId);

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

route.delete("/:pid", placessControllers.deletePlaceById);
module.exports = route;
