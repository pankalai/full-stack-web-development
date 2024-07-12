import { useState } from "react";
import { useDispatch } from 'react-redux'

import { addBlog } from "../reducers/blogReducer";
import { showNotification } from "../reducers/notificationReducer";

import { Input, Button } from "@mui/material";


const BlogForm = ({ togglableRef }) => {

  const dispatch = useDispatch()

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    const onSuccess = () => {
      dispatch(showNotification({ text: `a new blog '${newBlog.title}' by ${newBlog.author} added`, success: true }, 5))
      togglableRef.current.toggleVisibility();
      setTitle("");
      setAuthor("");
      setUrl("");
    }
    const onFailure = (error) => {
      dispatch(showNotification({ text: error.response.data.error, success: false }, 5))
    }

    dispatch(addBlog(newBlog, onSuccess, onFailure))
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <Input variant="standard"
            type="text" 
            value={title}
            id="new_blog_title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <Input variant="standard"
            type="text"
            value={author}
            id="new_blog_author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <Input variant="standard"
            type="text"
            value={url}
            id="new_blog_url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type="submit">create</Button>
      </form>
    </div>
  );
};

export default BlogForm;
