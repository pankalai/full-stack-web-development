interface HeaderProps {
  courseName: string;
}
interface TotalProps {
  totalExercises: number;
}


interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
interface CoursePartBasicWithDescription extends CoursePartBase {
  description: string;
}
interface CoursePartBasic extends CoursePartBasicWithDescription {
  kind: "basic"
}
interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}
interface CoursePartBackground extends CoursePartBasicWithDescription {
  backgroundMaterial: string;
  kind: "background"
}
interface CoursePartSpecial extends CoursePartBasicWithDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;


const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>;
}

const Content = (props: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {props.courseParts.map(part => (
        <Part key={part.name} {...part} />
      ))}
    </div>
  );
}

const Part = (props: CoursePart) => {
    switch (props.kind) {
      case "basic":
        return (
          <p>
            <b>{props.name} {props.exerciseCount}</b><br></br>
            {props.description}
          </p>
        );
      case "group":
        return (
          <p>
            <b>{props.name} {props.exerciseCount}</b><br></br>
            Project exercises: {props.groupProjectCount}
          </p>
        );
      case "background":
        return (
          <p>
            <b>{props.name} {props.exerciseCount}</b><br></br>
            {props.description}<br></br>
            Background material: {props.backgroundMaterial}
          </p>
        );
      case "special":
        return (
          <p>
            <b>{props.name} {props.exerciseCount}</b><br></br>
            {props.description}<br></br>
            Required skills: {props.requirements.join(", ")}
          </p>
        );
      default:
        return null;
    }
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

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
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