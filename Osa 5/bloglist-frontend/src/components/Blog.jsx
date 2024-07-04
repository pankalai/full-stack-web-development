import { useState } from 'react'


const Blog = ({ user, blog, editBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const like = (blog) => {
    const blogObject = {
      'user': blog.user.id,
      'title': blog.title,
      'author': blog.author,
      'url': blog.url,
      'likes': blog.likes + 1,
    }
    editBlog(blog.id, blogObject)
  }

  const remove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{(!visible) ? 'view' : 'hide'}</button>
      {visible &&
        <div>
          <div>{blog.url}</div>
          <div>likes: {blog.likes} <button onClick={() => like(blog)}>like</button></div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username &&
            <div><button onClick={() => remove(blog)}>remove</button></div>
          }
        </div>
      }
    </div>
  )
}

export default Blog