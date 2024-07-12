import { useRef } from "react";
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { Link } from 'react-router-dom'

import { useSelectedTheme } from '../contexts/ThemeContext'

import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { Paper,TableContainer,Table,TableBody,TableRow,TableCell } from "@mui/material";


const Blogs = () => {

    const blogFormRef = useRef();
  
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm togglableRef={blogFormRef}/>
        </Togglable>
        <BlogList />
      </div>
    );
  }


const BlogList = () => {
  const theme = useSelectedTheme()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const selectBlogs = state => state.blogs 

  const sortBlogs = createSelector([selectBlogs], (blogs) => 
          [...blogs].sort((a, b) => b.votes - a.votes)
      )

  const blogsToShow = useSelector(sortBlogs)

  return (
    <TableContainer component={Paper}>
    <Table>
      <TableBody>
      {blogsToShow.map((blog) => (
        <TableRow key={blog.id}>
          <TableCell>
            <Link to={`blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </TableCell>
        </TableRow>
      ))}
      </TableBody>
    </Table>
    </TableContainer>
  );
};


export default Blogs;