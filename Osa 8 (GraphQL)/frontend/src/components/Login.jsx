import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({ show, setToken, setError, setPage }) => {
    
    const [username, setUsername] = useState('matti')
    const [password, setPassword] = useState('secret')

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
        },
        onCompleted: () => {
          setError(null)
          setPage("authors")
        }
    })

    useEffect(() => {
        if ( result.data ) {
            const token = result.data.login.value
            localStorage.setItem('books-user-token', token)
            setToken(token)            
        }
    }, [result.data, setToken, setPage])

    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    if (!show) {
        return null
    }

    return (
        <div>
          <form onSubmit={submit}>
            <div>
              username <input
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type='submit'>login</button>
          </form>
        </div>
      )
}

Login.propTypes = {
  show: PropTypes.bool.isRequired,
  setToken: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
}

export default Login