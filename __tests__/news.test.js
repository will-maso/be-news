const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const data = require("../endpoints.js");

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
  test("responds with correct results when limited and offset", () => {
    return request(app)
      .get("/api/articles?limit=1&page=1")
      .expect(200)
      .then((result) => {
        expect(result.body.articles[0].total_count).toBe(1);
      });
  });
  test("responds with correct results when limited and offset", () => {
    return request(app)
      .get("/api/articles?limit=cheese&page=1")
      .expect(400)
      .then((result) => {
        expect(result.body).toEqual({
          msg: "Invalid data type for body or request",
        });
      });
  });
  test("responds with correct results when limited and offset", () => {
    return request(app)
      .get("/api/articles?limit=1&page=cheese")
      .expect(400)
      .then((result) => {
        expect(result.body).toEqual({
          msg: "Invalid data type for body or request",
        });
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
  test("responds with array of length one when limit set to one", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=1")
      .expect(200)
      .then((result) => {
        expect(result.body.comments.length).toBe(1);
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

describe("GET/api", () => {
  test("works as intended", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual(data);
      });
  });
});

describe("GET/users/:username", () => {
  test("works as intended", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((result) => {
        expect(result.body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("responds with correct error message for incorrect username", () => {
    return request(app)
      .get("/api/users/william")
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("this username doesn't exist");
      });
  });
});

describe("PATCH/api/comments/:comment_id", () => {
  test("responds with changed comment with correct input", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((result) => {
        expect(result.body.comment.comment_id).toBe(1);
        expect(result.body.comment.votes).toBe(21);
      });
  });
  test("responds with correct error message for datatype", () => {
    return request(app)
      .patch("/api/comments/cheese")
      .send({
        inc_votes: 1,
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
      .patch("/api/comments/9999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then((result) => {
        expect(result.text).toBe("Comment not found");
      });
  });
  test("responds with correct error message for incorrect patch body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: -10 })
      .expect(400)
      .then((result) => {
        expect(result.text).toBe("Invalid PATCH body");
      });
  });
  test("responds with correct error message for incorrect patch body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: -10 })
      .expect(400)
      .then((result) => {
        expect(result.text).toBe("Invalid PATCH body");
      });
  });
});

describe("POST/articles", () => {
  test("responds with posted article when given correct input", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "cats are great",
        body: "aren't they just",
        topic: "cats",
      })
      .expect(201)
      .then((result) => {
        expect(result.body.article).toMatchObject({
          author: "butter_bridge",
          title: "cats are great",
          body: "aren't they just",
          topic: "cats",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("responds with correct error messages", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "cats are great",
        body: "aren't they just",
      })
      .expect(400);
  });
  test("responds with correct error messages", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "cats are great",
        body: "aren't they just",
        topic: 2,
      })
      .expect(400);
  });
});
