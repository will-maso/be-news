const express = require("express");

const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsById,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid data type for body or request" });
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
  res.sendStatus(500);
});

module.exports = app;
