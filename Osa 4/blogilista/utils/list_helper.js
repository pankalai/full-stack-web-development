const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs.length) { return undefined }
    return blogs.reduce((favorite, current) => (favorite.likes < current.likes) ? current : favorite)
}

const mostBlogs = (blogs) => {
    if (!blogs.length) { return {} }
    const authors = blogs.reduce((info, blog) => {
        const author = blog.author
        info[author] = (info[author] || 0) + 1
        return info
    }, {})
    const most = Object.entries(authors).reduce((most_active, author) => most_active[1] < author[1] ? author : most_active)
    return { author: most[0], blogs: most[1] }
}

const mostLikes = (blogs) => {
    if (!blogs.length) { return {} }
    const authors = blogs.reduce((info, blog) => {
        const author = blog.author
        info[author] = (info[author] || 0) + blog.likes
        return info
    }, {})
    const most = Object.entries(authors).reduce((most_liked, author) => most_liked[1] < author[1] ? author : most_liked)
    return { author: most[0], likes: most[1] }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}