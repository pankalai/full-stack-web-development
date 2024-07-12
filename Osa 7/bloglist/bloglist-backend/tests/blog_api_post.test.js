const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("../tests/test_helper");

const User = require("../models/user");

let loginInfo;
let api_token;

describe("addition of a blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const user = { name: "root", username: "root", password: "secret" };
    await api
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send(user);

    loginInfo = await api
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send({ username: user.username, password: user.password });

    api_token = `Bearer ${loginInfo.body.token}`;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  test("succeeds with valid data", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: "Type wars II",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ "Content-Type": "application/json", Authorization: api_token });

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

    const contents = blogsAtEnd.map((b) => b.title);
    assert(contents.includes("Type wars II"));
  });

  test("responds with 400 if title or url of added blog is missing", async () => {
    const newBlog1 = {
      title: "Type wars II",
      author: "Robert C. Martin",
    };

    const newBlog2 = {
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html",
      author: "Robert C. Martin",
    };

    await api
      .post("/api/blogs")
      .set({ "Content-Type": "application/json", Authorization: api_token })
      .send(newBlog1)
      .expect(400);

    await api
      .post("/api/blogs")
      .set({ "Content-Type": "application/json", Authorization: api_token })
      .send(newBlog2)
      .expect(400);
  });

  test("responds with 401 if token is missing", async () => {
    const newBlog = {
      title: "Type wars II",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .set({ "Content-Type": "application/json" })
      .send(newBlog)
      .expect(401);
  });

  test("likes defaults to 0 if it is missing", async () => {
    const newBlog = {
      title: "Type wars II",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html",
    };
    const response = await api
      .post("/api/blogs")
      .set({ "Content-Type": "application/json", Authorization: api_token })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });
});
