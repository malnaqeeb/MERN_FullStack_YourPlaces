const express = require("express");
const route = express.Router();
const searchController = require("../controllers/search-controller");

route.get("/", searchController.getResults);

module.exports = route;
