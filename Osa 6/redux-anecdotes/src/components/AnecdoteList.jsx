import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/anecdoteNotifier'
import { createSelector } from '@reduxjs/toolkit'


const Anecdotes = () => {
    const dispatch = useDispatch()

    const selectAnecdotes = state => state.anecdotes 
    const selectFilter = state => state.filter

    const filterAnecdotes = createSelector([selectAnecdotes, selectFilter], (anecdotes, filter) => 
        anecdotes.filter(anecdote => 
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        ).sort((a, b) => b.votes - a.votes)
    )

    const anecdotes = useSelector(filterAnecdotes)
        
    const vote = async (id) => {
        dispatch(voteAnecdote(id))
        dispatch(setNotification(`You voted for '${anecdotes.find(a => a.id === id).content}'`,5))
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Anecdotes