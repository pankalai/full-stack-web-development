const Header = (props) => (
  <h1>{props.course.name}</h1>
)
const Content = (props) => (
  <div>
    <Part text={props.course.parts[0].name} count={props.course.parts[0].exercises} />
    <Part text={props.course.parts[1].name} count={props.course.parts[1].exercises} />
    <Part text={props.course.parts[2].name} count={props.course.parts[2].exercises} />
  </div>
)

const Part = (props) => (
  <p>
    {props.text} {props.count}
  </p>
)
const Total = (props) => (
  <p>Number of exercises {props.course.parts[0].exercises+props.course.parts[1].exercises+props.course.parts[2].exercises}</p>
)

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App