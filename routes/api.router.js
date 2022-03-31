const articlesRouter = require("./articles.router");
const usersRouter = require("./users.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const { getApi } = require("../controllers/api.controllers");
const apiRouter = require("express").Router();

apiRouter.get("/", getApi);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;