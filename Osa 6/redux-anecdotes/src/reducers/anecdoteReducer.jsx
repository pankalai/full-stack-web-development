import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        editAnecdote(state, action) {
          return state.map(anecdote =>
            anecdote.id !== action.payload.id ? anecdote : action.payload
          )
        },
        appendAnecdote(state, action) {
          state.push(action.payload)
        },
        setAnecdotes(state, action) {
          return action.payload
    }
  }
})

export const { editAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {  
  return async dispatch => {    
    const newAnecdote = await anecdoteService.createNew(content)    
    dispatch(appendAnecdote(newAnecdote))  
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const anecdoteToVote = await anecdoteService.get(id)
    const votedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }
    const anecdote = await anecdoteService.update(id, votedAnecdote)
    dispatch(editAnecdote(anecdote))
  }
}

export default anecdoteSlice.reducer