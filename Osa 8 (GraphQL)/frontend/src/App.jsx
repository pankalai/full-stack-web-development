import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notify from "./components/Notify";
import Recommend from "./components/Recommend";
import { BOOK_ADDED, ALL_BOOKS, AUTHOR_ADDED, ALL_AUTHORS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      setIsErrorMessage(false)
      notifyInfo(`New book added: ${data.data.bookAdded.title}`)
      console.log("new book added", data.data.bookAdded)
      client.cache.updateQuery({ query: ALL_BOOKS}, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(data.data.bookAdded)
        }
      })
      client.cache.updateQuery({ query: ALL_AUTHORS}, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map(author => {
            if (author.name === data.data.bookAdded.author.name) {
              return {
                ...author,
                bookCount: author.bookCount + 1
              }
            }
            return author
          })
        }
      })
      
    }
  })

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data, client }) => {
      setIsErrorMessage(false)
      console.log("new author added", data.data.authorAdded)
      client.cache.updateQuery({ query: ALL_AUTHORS}, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(data.data.authorAdded)
        }
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notifyError = (message) => {
    setIsErrorMessage(true)
    notifyInfo(message)
  }

  const notifyInfo = (message) => {
    setInfoMessage(message)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>

        <Notify infoMessage={infoMessage} isError={isErrorMessage} />
        <Authors show={page === "authors"} />
        <Books show={page === "books"} />
        <Login show={page === "login"} setToken={setToken} setError={notifyError} setPage={setPage} />

    </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Notify infoMessage={infoMessage} isError={isErrorMessage} />
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} setError={notifyError} />
      <Recommend show={page === 'recommend'} />

    </div>
  );
};

export default App;
