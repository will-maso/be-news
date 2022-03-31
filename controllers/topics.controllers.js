const { fetchTopics, addTopic } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((result) => {
      res.send({ topics: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const input = req.body;
  addTopic(input)
    .then((result) => {
      res.status(201).send({ topic: result });
    })
    .catch((err) => {
      next(err);
    });
};
