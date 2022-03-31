const { fetchUsers, fetchUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((result) => {
      res.send({ users: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((result) => {
      res.send({ user: result });
    })
    .catch((err) => {
      next(err);
    });
};
