const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.addTopic = (input) => {
  if (input.slug && input.description) {
    return db
      .query(
        "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
        [input.slug, input.description]
      )
      .then((result) => {
        return result.rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid patch body" });
  }
};
