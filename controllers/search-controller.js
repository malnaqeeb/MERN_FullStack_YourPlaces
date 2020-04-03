const User = require("../model/user");
const Place = require("../model/place");
const HttpError = require("../model/http-error");

const getResults = async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return next(new HttpError("Query cannot be empty", 400));
  }
  const results = {};

  try {
    results.places = await Place.find({
      title: { $regex: query, $options: "i" }
    });
    // Provides regular expression capabilities for pattern matching strings in queries
    results.users = await User.find({ name: { $regex: query, $options: "i" } });
    res.json({ results });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }
};

module.exports = {
  getResults
};
