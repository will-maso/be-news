const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INTEGER AS comment_count
        FROM comments
        LEFT JOIN articles
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Invalid article_id" });
      }
    });
};

exports.changeArticleById = (article_id, inc_votes) => {
  if (inc_votes) {
    return db
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
        [inc_votes, article_id]
      )
      .then((result) => {
        if (!result.rows.length) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else {
          return result.rows[0];
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid PATCH body" });
  }
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INTEGER AS comment_count
    FROM comments
    LEFT JOIN articles
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id;`
    )
    .then((result) => {
      return result.rows;
    });
};
