const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsById,
  postCommentById,
  postArticle,
  removeArticleById,
} = require("../controllers/articles.controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(removeArticleById);

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postCommentById);

module.exports = articlesRouter;
