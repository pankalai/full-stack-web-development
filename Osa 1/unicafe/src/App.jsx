import { useState } from 'react'

const Button = ({text, clickHandler}) => {
  return <button onClick={clickHandler}>{text}</button>
}

const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({good, neutral, bad}) => {
  const total = () => good+neutral+bad
  if (total() === 0) {
    return <div>No feedback given</div>
  }
  return(
    <table>
      <tbody>
        <StatisticLine text="good" value ={good} />
        <StatisticLine text="neutral" value ={neutral} />
        <StatisticLine text="bad" value ={bad} />
        <StatisticLine text="all" value ={total()} />
        <StatisticLine text="average" value ={(good+bad*(-1))/total()} />
        <StatisticLine text="positive" value ={good/(total())*100 + "%"} />
      </tbody>
    </table>
  )
}

function App() {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good+1)
  const handleNeutralClick = () => setNeutral(neutral+1)
  const handleBadClick = () => setBad(bad+1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" clickHandler={handleGoodClick} />
      <Button text="neutral" clickHandler={handleNeutralClick} />
      <Button text="bad" clickHandler={handleBadClick} />
      
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
