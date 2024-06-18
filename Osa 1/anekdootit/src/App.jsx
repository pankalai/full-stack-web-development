import { useState } from 'react'

const TopAnecdote = ({index, anecdotes, votes}) => {
  if (index === -1) {
    return <div>No votes</div>
  }
  return (
    <>
      <div>{anecdotes[index]}</div>
      <div>has {votes[index]} votes</div>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const n = anecdotes.length

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(n).fill(0))
  const [top_index, setTopIndex] = useState(-1)

  const vote = () => {
    const votes2 = [...votes]
    votes2[selected] += 1
    setVotes(votes2)
    if (votes2[selected] > votes2[top_index] || top_index === -1) {setTopIndex(selected)}
  }
  
  const GetRandomInteger = (max) => Math.floor(Math.random() * max)
  const selectAnecdote = () => setSelected(GetRandomInteger(n))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={vote}>vote</button>
      <button onClick={selectAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <TopAnecdote index={top_index} anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App