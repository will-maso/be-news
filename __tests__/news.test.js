const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("Get/api/topics", () => {
  test("responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body.topics).toBeInstanceOf(Array);
        result.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("responds with correct error message", () => {
    return request(app).get("/api/slug").expect(404);
  });
});

describe("GET/api/articles/:article_id", () => {
  test("responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        expect(result.body.article).toBeInstanceOf(Object);
        expect(result.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
  });
  test("responds with correct error message", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((result) => {});
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("responds with changed article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((result) => {
        expect(result.body.article).toBeInstanceOf(Object);
        expect(result.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
        expect(result.body.article.votes).toBe(101);
      });
  });
  test("responds with changed article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then((result) => {
        expect(result.body.article).toBeInstanceOf(Object);
        expect(result.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
        expect(result.body.article.votes).toBe(90);
      });
  });
  test("responds with correct error message", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("Article not found");
      });
  });
  test("responds with correct error message for incorrect patch body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ votes: -10 })
      .expect(400)
      .then((result) => {});
  });
  test("responds with correct error message for incorrect patch body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "cheese" })
      .expect(400)
      .then((result) => {});
  });
});

describe("GET/api/users", () => {
  test("responds with array of user objects with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        expect(result.body.users).toBeInstanceOf(Array);
        result.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
      });
  });
});

describe("GET/api/articles/article_id   comment count", () => {
  test("responds with article object with correct comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        expect(result.body.article).toBeInstanceOf(Object);
        expect(result.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
  });
});

describe("GET/api/articles", () => {
  test("response with array of article objects with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeInstanceOf(Array);
        result.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe.only("GET/api/articles/:article_id/comments", () => {
  test("responds with array of comments with correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toBeInstanceOf(Array);
        result.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("responds with correct error message", () => {
    return request(app)
      .get("/api/articles/cheese/comments")
      .expect(400)
      .then((result) => {
        expect(result.body).toEqual({
          msg: "Invalid data type for body or request",
        });
      });
  });
  test("responds with correct error message", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("article not found");
      });
  });
  test("responds with correct error message", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toBeInstanceOf(Array);
        expect(result.body.comments.length).toBe(0);
      });
  });
});
