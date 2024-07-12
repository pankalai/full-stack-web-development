const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("../tests/test_helper");

const Blog = require("../models/blog");

let loginInfo;
let api_token;

describe("deletion of a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    // login and get token
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

    // create a blog
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
  });

  after(async () => {
    await mongoose.connection.close();
  });

  test("succeeds with a status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: api_token })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const contents = blogsAtEnd.map((b) => b.title);
    assert(!contents.includes(blogToDelete.title));
  });

  test("returns status code 400 if id is invalid", async () => {
    const blogsAtStart = await helper.blogsInDb();

    await api
      .delete(`/api/blogs/2`)
      .set({ Authorization: api_token })
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });
});
