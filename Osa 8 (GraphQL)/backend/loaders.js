const DataLoader = require('dataloader');
const Book = require('./models/book');

const booksOfAuthors = new DataLoader(async (author_ids) => {
    const books = await Book.find({});
    const bookCount = books.reduce((acc, book) => {
        acc[book.author] = acc[book.author] ? acc[book.author] + 1 : 1;
        return acc;
    }, {});

    return author_ids.map(key => bookCount[key] || 0);
});

module.exports = {
    booksOfAuthors,
};