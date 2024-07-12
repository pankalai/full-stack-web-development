const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const helper = require("../tests/test_helper");

describe("favorite blog", () => {
  test("when list is empty returns undefined", () => {
    assert.strictEqual(listHelper.favoriteBlog([]), undefined);
  });

  test("when list has only one blog returns that", () => {
    assert.strictEqual(
      listHelper.favoriteBlog([helper.initialBlogs[0]]),
      helper.initialBlogs[0],
    );
  });

  test("when list has multiple blogs returns one with most likes", () => {
    assert.strictEqual(
      listHelper.favoriteBlog(helper.initialBlogs),
      helper.initialBlogs[2],
    );
  });
});
