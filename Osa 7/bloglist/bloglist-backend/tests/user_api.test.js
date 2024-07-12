const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");

const api = supertest(app);

const helper = require("./test_helper");

const User = require("../models/user");

describe("user is not created when", () => {
  after(async () => {
    await mongoose.connection.close();
  });

  test("username is missing", async () => {
    const newUser = {
      name: "Pekka Pekkanen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("username is a required field"));
  });

  test("password is missing", async () => {
    const newUser = {
      name: "Pekka Pekkanen",
      username: "pekka",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("password is missing"));
  });

  test("username is too short", async () => {
    const newUser = {
      name: "Pekka Pekkanen",
      username: "pe",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes(
        "`username` (`pe`) is shorter than the minimum allowed length",
      ),
    );
  });

  test("password is too short", async () => {
    const newUser = {
      name: "Pekka Pekkanen",
      username: "pekka",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    );
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
