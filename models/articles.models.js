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

// db.query("SELECT ARRAY_AGG(topic) FROM articles ORDER BY topic");

exports.fetchArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  const queryValues = [];
  const Topics = await db.query("SELECT slug FROM topics;");
  const validTopics = Topics.rows.map((topic) => topic.slug);
  const validsort_by = [
    "created_at",
    "title",
    "topic",
    "author",
    "body",
    "votes",
  ];
  const validorder = ["asc", "desc"];
  let querystr = `SELECT articles.*, COUNT(comments.article_id)::INTEGER AS comment_count
    FROM comments
    LEFT JOIN articles
    ON articles.article_id = comments.article_id`;
  if (validTopics.includes(topic)) {
    querystr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }
  querystr += ` GROUP BY articles.article_id`;
  if (validsort_by.includes(sort_by) && validorder.includes(order)) {
    querystr += ` ORDER BY ${sort_by} ${order};`;
  } else {
    return Promise.reject({ status: 400, msg: "incorrect sort_by or order" });
  }
  if (topic) {
    if (queryValues.length) {
      const result = await db.query(querystr, queryValues);
      return result.rows;
    } else {
      return Promise.reject({ status: 404, msg: "this topic does not exist" });
    }
  }
  const result = await db.query(querystr, queryValues);
  return result.rows;
};

exports.fetchCommentsById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length) {
        return db
          .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
          .then((result) => {
            return result.rows;
          });
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.addCommentById = (article_id, body, username) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (result.rows.length) {
        return db
          .query(
            "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3)",
            [article_id, body, username]
          )
          .then(() => {
            return db
              .query(`SELECT * FROM comments WHERE article_id = $1;`, [
                article_id,
              ])
              .then((result) => {
                return result.rows[0];
              });
          });
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};
