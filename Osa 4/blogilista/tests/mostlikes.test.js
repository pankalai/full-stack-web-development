const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('../tests/test_helper')

describe('most liked bloggers', () => {

    test('when list is empty returns empty', () => {
        assert.deepEqual(
            listHelper.mostLikes([]), 
            {}
        )
    })

    test('when list has only one blog returns that', () => {
        assert.deepEqual(
            listHelper.mostLikes(helper.initialBlogs.filter(blog => blog._id === '5a422a851b54a676234d17f7')), 
            { author: 'Michael Chan', likes: 7}
        )
    })

    test('when list has multiple blogs returns blogger with most likes', () => {
        assert.deepEqual(
            listHelper.mostLikes(helper.initialBlogs), 
            { author: 'Edsger W. Dijkstra', likes: 17})
    })

})