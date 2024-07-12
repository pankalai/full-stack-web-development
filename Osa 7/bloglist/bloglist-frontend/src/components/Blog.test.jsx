import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import AddBlog from "./AddBlog";

describe("Blog component", () => {
  let testUser;
  let blog;
  let user;
  let like;
  let viewButton;

  beforeEach(() => {
    testUser = {
      username: "testuser",
      name: "Test User",
    };

    blog = {
      title: "Blog Title",
      author: "Blog Author",
      url: "https://testing-library.com/",
      likes: 5,
      user: testUser,
    };

    like = vi.fn();
    user = userEvent.setup();
    render(<Blog blog={blog} user={testUser} editBlog={like} />);
    viewButton = screen.getByText("view", { exact: false });
  });

  test("renders title", () => {
    const element = screen.getByText("Blog Title", { exact: false });
    expect(element).toBeDefined();
  });

  test("shows more info after clicking view button", async () => {
    // Before clicking the button
    const elementUrl = screen.queryByText("https://testing-library.com/");
    expect(elementUrl).toBeNull();

    const elementLikes = screen.queryByText("likes");
    expect(elementLikes).toBeNull();

    const elementUser = screen.queryByText("Test User");
    expect(elementUser).toBeNull();

    // Click the button
    await user.click(viewButton);

    // After clicking the button
    const elementUrlAfter = screen.queryByText("https://testing-library.com/");
    expect(elementUrlAfter).not.toBeNull();

    const elementLikesAfter = screen.queryByText("likes", { exact: false });
    expect(elementLikesAfter).not.toBeNull();

    const elementLikesCountAfter = screen.queryByText("5", { exact: false });
    expect(elementLikesCountAfter).not.toBeNull();

    const elementUserAfter = screen.queryByText("Test User");
    expect(elementUserAfter).not.toBeNull();
  });

  test("accepts like button to be clicked twice", async () => {
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(like.mock.calls).toHaveLength(2);
  });
});

describe("when creating a blog", () => {
  test("callback function is called with proper data", async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    const { container } = render(<AddBlog createBlog={createBlog} />);

    const titleInput = container.querySelector("#new_blog_title");
    const authorInput = container.querySelector("#new_blog_author");
    const urlInput = container.querySelector("#new_blog_url");
    const createButton = container.querySelector('button[type="submit"]');

    await user.type(titleInput, "Blog Title");
    await user.type(authorInput, "Blog Author");
    await user.type(urlInput, "https://testing-library.com/");
    await user.click(createButton);

    expect(createBlog.mock.calls[0][0].title).toBe("Blog Title");
    expect(createBlog.mock.calls[0][0].author).toBe("Blog Author");
    expect(createBlog.mock.calls[0][0].url).toBe(
      "https://testing-library.com/",
    );
  });
});
