const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', { 
            username: 1, 
            name: 1, 
            id: 1
        })
    response.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    if (! (user && user.id)) {    
        return response.status(401).json({ error: 'token invalid' })  
    }  

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (user.id !== blog.user.toString()) {
        return response.status(401).json({ error: 'token invalid' })  
    }
    await Blog.deleteOne({ _id: request.params.id })
    response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user
    const blogToUpdate = await Blog.findById(request.params.id)

    if (user.id !== blogToUpdate.user.toString()) {
        return response.status(401).json({ error: 'token invalid' })  
    }

    const blogUpdates = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogUpdates, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter