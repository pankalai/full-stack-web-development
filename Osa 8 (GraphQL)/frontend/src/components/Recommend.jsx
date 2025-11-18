import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import { ALL_BOOKS, FAVORITE_GENRE } from '../queries'
import { useState, useEffect } from 'react'

const Recommend = ({ show }) => {

    const [genre, setGenre] = useState(null)
    const genreQuery = useQuery(FAVORITE_GENRE, {
        fetchPolicy: "network-only",
        nextFetchPolicy: "cache-first"
    })
    
    const booksQuery = useQuery(ALL_BOOKS, {
        variables: { genre: genre },
        skip: !genre
    })
    
    useEffect(() => {
        if (genreQuery.data) {
            setGenre(genreQuery.data.me?.favoriteGenre || null)
        }
    }, [genreQuery.data])
         

    if (!show) {
        return null
    }

    if (genreQuery.loading || booksQuery.loading) {
        return <p>Loading...</p>;
    }

    const books = booksQuery.data ? booksQuery.data.allBooks : []

    return (
        <div>
            <h2>Recommendations</h2>
            <p>books in your favorite genre <strong>{genre || "unknown"}</strong></p>

            <table>
            <tbody>
                <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
                </tr>
                {books.map((a) => (
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
            </tbody>
            </table>
            
        </div>
    )
}

Recommend.propTypes = {
  show: PropTypes.bool.isRequired,
}

export default Recommend
