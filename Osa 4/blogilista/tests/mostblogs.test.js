const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('../tests/test_helper')

describe('most active bloggers', () => {
   
  
    test('when list is empty returns empty', () => {
        assert.deepEqual(
            listHelper.mostBlogs([]), 
            {}
        )
    })

    test('when list has only one blog returns author', () => {
        assert.deepEqual(
            listHelper.mostBlogs(helper.initialBlogs.filter(blog => blog._id === '5a422a851b54a676234d17f7')), 
            { author: 'Michael Chan', blogs: 1}
        )
    })

    test('when list has multiple blogs returns author with most blogs', () => {
        assert.deepEqual(
            listHelper.mostBlogs(helper.initialBlogs), 
            { author: 'Robert C. Martin', blogs: 3})
    })

})