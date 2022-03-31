const { removeComments, changeComment } = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComments(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  changeComment(comment_id, inc_votes)
    .then((result) => {
      res.send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};
