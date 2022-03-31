const db = require("../db/connection");

exports.removeComments = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then((result) => {
      if (result.rows.length) {
        return db
          .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
          .then(() => {});
      } else {
        return Promise.reject({ status: 404, msg: "Invalid comment_id" });
      }
    });
};

exports.changeComment = (comment_id, inc_votes) => {
  if (typeof inc_votes === "number") {
    return db
      .query(
        "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
        [inc_votes, comment_id]
      )
      .then((result) => {
        if (!result.rows.length) {
          return Promise.reject({ status: 404, msg: "Comment not found" });
        } else {
          return result.rows[0];
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid PATCH body" });
  }
};
