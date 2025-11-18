import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types';
import { ALL_AUTHORS } from '../queries'
import BirthYearForm from './SetBirthYearForm';
import { useState, useEffect } from 'react';

const Authors = (props) => {

  const [authors, setAuthors] = useState([])
  const authorsQuery = useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (authorsQuery.data) {
      setAuthors(authorsQuery.data.allAuthors)
    }
  }, [authorsQuery.data])


  if (!props.show) {
    return null
  }

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <BirthYearForm authors={authors}/>
      </div>
    </div>
  )
}

Authors.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Authors

