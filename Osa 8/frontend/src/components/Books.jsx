import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const [booksToShow, setBooksToShow] = useState()
  const [genre, setGenre] = useState('all genres')
  const [genres, setGenres] = useState([])

  const booksQuery = useQuery(ALL_BOOKS)
  const filteredBooksQuery = useQuery(ALL_BOOKS, {
    variables: { genre: genre === 'all genres' ? null : genre }
  })

  useEffect(() => {
    if (filteredBooksQuery.data) {
      setBooksToShow(filteredBooksQuery.data.allBooks)
    }
  }, [genre, filteredBooksQuery.data])

  useEffect(() => {
    if (booksQuery.data) {
      const genres = booksQuery.data.allBooks.reduce((acc, book) => {
        book.genres.forEach(g => {
          if (!acc.includes(g)) {
            acc.push(g)
          }
        })
        return acc
      }, [])
      setGenres(genres)
      filteredBooksQuery.refetch()
    }
  }, [booksQuery.data, filteredBooksQuery])
  
  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      {genre !== 'all genres' ? (
        <p>in genre <strong>{genre}</strong></p>
      ) : (
        <p></p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              <td>{a.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
        
      <div>
       {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
       ))}
       <button onClick={() => setGenre('all genres')}>all genres</button>
      </div>
      
    </div>
  )
}

Books.propTypes = {
  show: PropTypes.bool.isRequired,
}

export default Books
