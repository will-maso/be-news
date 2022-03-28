const express = require("express");

const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
