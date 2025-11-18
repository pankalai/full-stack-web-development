import { useState, useRef } from 'react'
import Select from 'react-select';
import { useMutation } from '@apollo/client'
import { SET_BIRTH_YEAR, ALL_AUTHORS} from '../queries'
import PropTypes from 'prop-types';

const BirthYearForm = ({ authors }) => {
    const [author, setAuthor] = useState(null)
    const [birthYear, setYear] = useState('')

    const selectAuthorRef = useRef();
    const author_options = authors.filter(a => !a.born).map(a => ({ value: a.name, label: a.name }))

    const [setBirthYear] = useMutation(SET_BIRTH_YEAR, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    const submit = async (event) => {
        event.preventDefault()

        if (!author || !birthYear) return
        
        selectAuthorRef.current.clearValue()

        setBirthYear({ variables: { name: author.value, born: parseInt(birthYear) } })
        setAuthor(null)
        setYear('')
    }

    return (
    <form onSubmit={submit}>
        <h2>set birthyear</h2>
        <div>
            name
            <Select 
                ref={selectAuthorRef}
                defaultValue={author}
                onChange={setAuthor}
                options={author_options}
                isClearable={true}
            />
        </div>
        <div>
            born
            <input
                value={birthYear}
                onChange={({ target }) => setYear(target.value)}
            />
        </div>
        <button type='submit'>update author</button>
    </form>
    )
}

BirthYearForm.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default BirthYearForm