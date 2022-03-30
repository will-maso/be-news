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
  test("responds with correct error message for 404", () => {
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
  test("responds with correct error message for 404", () => {
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
  test("responds with correct error message for 404", () => {
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
  test("endpoint works as intended with default queries", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeInstanceOf(Array);
        expect(result.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("endpoint works as intended with topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((result) => {
        expect(result.body.articles.length).toBe(1);
      });
  });
  test("responds with correct error message for incorrect query", () => {
    return request(app)
      .get("/api/articles?topic=will")
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("this topic does not exist");
      });
  });
  test("responds with correct error message for incorrect datatype", () => {
    return request(app)
      .get("/api/articles?sort_by=2")
      .expect(400)
      .then((result) => {
        expect(result.text).toBe("incorrect sort_by or order");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
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
  test("responds with correct error message for datatype", () => {
    return request(app)
      .get("/api/articles/cheese/comments")
      .expect(400)
      .then((result) => {
        expect(result.body).toEqual({
          msg: "Invalid data type for body or request",
        });
      });
  });
  test("responds with correct error message for 404", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("article not found");
      });
  });
  test("responds with empty array for article without comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toBeInstanceOf(Array);
        expect(result.body.comments.length).toBe(0);
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("responds with posted comment in correct format", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
        body: "this is great",
      })
      .expect(200)
      .then((result) => {
        expect(result.body.comment).toBeInstanceOf(Object);
        expect(result.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("responds with correct error message for datatype", () => {
    return request(app)
      .post("/api/articles/cheese/comments")
      .send({
        username: "butter_bridge",
        body: "this is great",
      })
      .expect(400)
      .then((result) => {
        expect(result.body).toEqual({
          msg: "Invalid data type for body or request",
        });
      });
  });
  test("responds with correct error message for 404", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send({
        username: "butter_bridge",
        body: "this is great",
      })
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("article not found");
      });
  });
  test("responds with correct error message for psql error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        name: "butter_bridge",
        body: "this is great",
      })
      .expect(400)
      .then((result) => {
        expect(result.body).toMatchObject({
          msg: "Invalid data type for body or request",
        });
      });
  });
  test("responds with correct error message for incorrect username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "will",
        body: "best thing since sliced bread",
      })
      .expect(400)
      .then((result) => {
        expect(result.body).toMatchObject({
          msg: "Input in body does not exist in database",
        });
      });
  });
});

describe("DELETE/api/comments/:comment_id", () => {
  test("works as intended", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {});
  });
  test("returns 404 not found for invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(() => {});
  });
  test("returns 400 for wrong datatype in comment_id", () => {
    return request(app)
      .delete("/api/comments/cheese")
      .expect(400)
      .then(() => {});
  });
});

describe.only("GET/api", () => {
  test("works as intended", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        expect(result.body).toMatchObject({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all topics",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                },
              ],
            },
          },
          "DELETE/api/comments/:comment_id": {
            description: "returns 204 no content after successful deletion",
            exampleResponse: { "err.status": 204 },
          },
          "GET/api/articles/:article_id": {
            description: "returns article object with correct properties",
            exampleResponse: {
              comment_id: 1,
              votes: 6,
              created_at: "2020-10-11",
              author: "william",
              body: "this is my article",
            },
          },
          "GET/api/users": {
            description: "returns an array of all users",
            exampleResponse: [
              {
                username: "william",
              },
            ],
          },
          "GET/api/articles/:article_id/comments": {
            description:
              "returns an array of all comments for a given article id",
            exampleResponse: [
              {
                comment_id: 1,
                votes: 5,
                created_at: "2021-10-9",
                author: "william",
                body: "this is my comment",
              },
            ],
          },
          "POST/api/articles/:article_id/comments": {
            description:
              "responds with the posted comment when given correct input",
            exampleResponse: {
              comment_id: 1,
              votes: 0,
              created_at: "2046-12-07",
              author: "william",
              body: "this is my comment",
            },
            exampleBody: {
              username: "william",
              body: "this is my comment",
            },
          },
          "PATCH/api/articles/:article_id": {
            description: "returns the updated object when given correct input",
            exampleResponse: {
              author: "william",
              title: "the saga",
              article_id: 1,
              body: "this is my article",
              topic: "cats",
              created_at: "2022-05-03",
              votes: 100,
            },
            exampleBody: { inc_votes: 1 },
          },
        });
      });
  });
});
