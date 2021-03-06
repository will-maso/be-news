const {
  fetchArticleById,
  changeArticleById,
  fetchArticles,
  fetchCommentsById,
  addCommentById,
  addArticle,
  deleteArticle,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((result) => {
      res.send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, page } = req.query;
  fetchArticles(sort_by, order, topic, limit, page)
    .then((result) => {
      res.send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticleById(article_id, inc_votes)
    .then((result) => {
      res.send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, page } = req.query;
  fetchCommentsById(article_id, limit, page)
    .then((result) => {
      res.send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req.body;
  const { username } = req.body;
  addCommentById(article_id, body, username)
    .then((result) => {
      res.send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const input = req.body;
  addArticle(input)
    .then((result) => {
      res.status(201).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
