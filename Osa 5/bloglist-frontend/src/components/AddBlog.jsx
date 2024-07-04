import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    if (await createBlog(newBlog)) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            id="new_blog_title"
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            id="new_blog_author"
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            id="new_blog_url"
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button
          type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm