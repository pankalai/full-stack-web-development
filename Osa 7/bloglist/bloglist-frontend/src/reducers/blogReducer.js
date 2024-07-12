import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'


const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        editBlog(state, action) {
          return state.map(blog =>
            blog.id !== action.payload.id ? blog : action.payload
          )
        },
        appendBlog(state, action) {
          state.push(action.payload)
        },
        setBlogs(state, action) {
          return action.payload
        },
        removeBlog(state, action) {
          return state.filter(b => b.id !== action.payload)
        }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const likeBlog = (blog) => {
  const toLike = { ...blog, likes: blog.likes + 1 }
  return async dispatch => {
    const blog = await blogService.update(toLike)
    dispatch(editBlog(blog))
  }
}

export const commentBlog = (blog, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.comment(blog.id, comment)
    dispatch(editBlog(updatedBlog))
  }
}

export const deleteBlog = id => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(removeBlog(id))
    }
}

export const addBlog = (content, onSuccess, onFailure) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
      onSuccess()
    } catch (error) {
      onFailure(error)
    }
  }
}

export const { editBlog, appendBlog, setBlogs, removeBlog } = blogSlice.actions
export default blogSlice.reducer