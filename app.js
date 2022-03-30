const express = require("express");

const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsById,
  postCommentById,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { deleteComment } = require("./controllers/comments.controllers");
const { getApi } = require("./controllers/api.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentById);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api", getApi);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  const badReq = ["23502", "22P02"];
  if (badReq.includes(err.code)) {
    res.status(400).send({ msg: "Invalid data type for body or request" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Input in body does not exist in database" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err.msg);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
