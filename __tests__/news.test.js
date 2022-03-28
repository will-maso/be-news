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

describe.only("GET/api/articles/:article_id", () => {
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
        });
      });
  });
  test("responds with correct error message", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(400)
      .then((result) => {
        console.log("THIS IS MY CHANGE");
      });
  });
});
