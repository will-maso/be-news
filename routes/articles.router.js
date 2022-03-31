const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsById,
  postCommentById,
} = require("../controllers/articles.controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
articlesRouter.get("/", getArticles);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postCommentById);

module.exports = articlesRouter;
