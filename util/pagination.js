const paginationResults = (model) => {
  return async (req, res, next) => {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const sortBy = req.query.sortBy || "name";
    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model
        .find({}, "-password")
        .limit(limit)
        .skip(startIndex)
        .collation({ locale: "en" })
        .sort(sortBy)
        .exec();
      results.totalPages = Math.ceil(
        (await model.countDocuments().exec()) / limit
      );
      res.paginatios = results;

      next();
    } catch (error) {
      next(res.status(500).json(error.message));
    }
  };
};
module.exports = paginationResults;
