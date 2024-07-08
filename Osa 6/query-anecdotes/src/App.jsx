import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useNotificationDispatch } from './NotificationContext'
import { getAnecdotes, updateAnecdote } from './requests'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'


const App = () => {

  const notificationDispatch = useNotificationDispatch()

  const queryClient = useQueryClient()

  const result = useQuery({    
    queryKey: ['anecdotes'],    
    queryFn: getAnecdotes,
    retry: 1,
  })  

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({ type: 'SHOW' , payload: `You voted '${anecdote.content}'` })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  if ( result.isLoading ) {    
    return <div>loading data...</div>  }


  if ( result.isError ) {    
    return <div>anecdote service not available due to problemns in server</div>  
  }

  const anecdotes = result.data

  return (
    
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>

  )
}

export default App
