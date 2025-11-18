interface HeaderProps {
  courseName: string;
}

interface ContentProps {
  courseParts: {
    name: string;
    exerciseCount: number;
  }[];
}

interface TotalProps {
  totalExercises: number;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>;
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map(part => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
}

const Total = (props: TotalProps) => {
  return (
    <p>
      Number of exercises {props.totalExercises}
    </p>
  );
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;