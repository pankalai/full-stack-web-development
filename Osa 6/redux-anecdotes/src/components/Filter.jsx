import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/anecdoteFilter'

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
      dispatch(setFilter(event.target.value))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        <strong>Filter:</strong> <input onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter