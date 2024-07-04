import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import Togglable from './components/Togglable'
import LoginForm from './components/Login'
import Blog from './components/Blog'
import AddBlog from './components/AddBlog'


const NotificationBar = ({ message }) => {
  const notificationStyle = {
    color: message.success ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 16,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (message.text === null) {
    return null
  }
  return (
    <div style={notificationStyle}>
      {message.text}
    </div>
  )
}

const BlogList = ({ user, blogs, editBlog, deleteBlog }) => {
  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} user={user} blog={blog} editBlog={editBlog} deleteBlog={deleteBlog} />
        )
      }
    </div>
  )
}

const App = () => {

  const [user, setUser] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState({ text: null, success: null })

  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)

    } catch (exception) {
      setNotificationMessage({ text: 'wrong credentials', success: false })
      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)
      return false
    }
    return true
  }

  const logout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      blog.user = user
      setBlogs(blogs.concat(blog))
      setNotificationMessage({ text: `a new blog ${ blog.title } by ${ blog.author } added`, success: true })

      blogFormRef.current.toggleVisibility()

      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)

    } catch (exception) {
      setNotificationMessage({ text: 'failed to create blog', success: false })
      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)

      return false
    }
    return true
  }

  const editBlog = async (id, blogObject) => {
    try {
      const blog = await blogService.update(id, blogObject)
      blog.user = user
      const updatedBlogs = blogs.map(b => b.id === blog.id ? blog : b)
      setBlogs(updatedBlogs)
      setNotificationMessage({ text: `blog ${blog.title} updated`, success: true })
      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)
    }
    catch (exception) {
      setNotificationMessage({ text: 'failed to update blog', success: false })
      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      const FilteredBlogs = blogs.filter(b => b.id !== id)
      setBlogs(FilteredBlogs)
      setNotificationMessage({ text: 'blog removed', success: true })
      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)
    }
    catch (exception) {
      setNotificationMessage({ text: 'failed to remove blog', success: false })
      setTimeout(() => {
        setNotificationMessage({ text: null, success: null })
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <NotificationBar message={notificationMessage} />
        <LoginForm login = {login} />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <NotificationBar message={notificationMessage} />
      <p>{user.name} logged in <button onClick={logout}>logout</button></p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <AddBlog createBlog={ addBlog }/>
      </Togglable>
      <BlogList user={ user } blogs={ blogs } editBlog={ editBlog } deleteBlog={ deleteBlog } />
    </div>
  )
}

export default App