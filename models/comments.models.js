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
