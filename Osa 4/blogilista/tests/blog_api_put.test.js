const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../tests/test_helper')

const Blog = require('../models/blog')

let loginInfo
let api_token

describe('update of a blog', () => {

    beforeEach(async () => {  
        await Blog.deleteMany({}) 

        // login and get token
        const user = { name: 'root', username: 'root', password: 'secret' }
        await api
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .send(user)

        loginInfo = await api
            .post('/api/login')
            .set('Content-Type', 'application/json')
            .send({ username: user.username, password: user.password })

        api_token = `Bearer ${loginInfo.body.token}`

        // create a blog
        const newBlog = {
            title: "Type wars II",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html",
            likes: 2
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ 'Content-Type': 'application/json', 'Authorization': api_token })
    })

    after(async () => {
        await mongoose.connection.close()
    })


    test('succeeds if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {...blogToUpdate, likes: blogToUpdate.likes+1}

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .set({ 'Content-Type': 'application/json', 'Authorization': api_token })
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const content = blogsAtEnd.filter(b => b.title === blogToUpdate.title)[0]

        assert.strictEqual(content.likes, blogToUpdate.likes + 1)
    })

    test('returns status code 400 if id is invalid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {...blogToUpdate, likes: blogToUpdate.likes+1}

        await api
            .put(`/api/blogs/2`)
            .send(updatedBlog)
            .set({ 'Content-Type': 'application/json', 'Authorization': api_token })
            .expect(400)

    })

})