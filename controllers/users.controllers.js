const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((result) => {
      res.send({ users: result });
    })
    .catch((err) => {
      next(err);
    });
};
