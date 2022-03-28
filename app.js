const express = require("express");

const app = express();
app.use(express.json());

const { getTopics } = require("./new.controllers");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
