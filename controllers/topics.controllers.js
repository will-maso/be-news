const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
};
