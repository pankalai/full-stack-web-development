import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        author {
            name
        }
        published
        genres
    }
`;

const AUTHOR_DETAILS = gql`
    fragment AuthorDetails on Author {
        name
    }
`;

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

export const ALL_BOOKS = gql`
    query ($genre: String) {
        allBooks (
            genre: $genre
        ) {
            title
            author {
                name
            }
            published
            genres
        }
    }
`;

export const FAVORITE_GENRE = gql`
    query {
        me {
            favoriteGenre
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
            }
            published
            genres
        }
    }
`;   

export const SET_BIRTH_YEAR = gql`
    mutation setBirthYear($name: String!, $born: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $born
        ) {
            name
            born
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(
            username: $username,
            password: $password
        ) {
            value
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const AUTHOR_ADDED = gql`
    subscription {
        authorAdded {
            ...AuthorDetails
        }
    }
    ${AUTHOR_DETAILS}
`