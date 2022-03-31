const express = require("express");
const apiRouter = require("./routes/api.router");
const app = express();
app.use(express.json());
app.use("/api", apiRouter);

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
