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

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

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

const PartContainer: React.FC<{ name: string; count: number; children: React.ReactNode }> =
({ name, count, children }) => (
  <p>
    <b>{name} {count}</b><br />
    {children}
  </p>
);

const BasicPart = ({ name, exerciseCount, description }: CoursePartBasic) => (
  <PartContainer name={name} count={exerciseCount}>
    {description}
  </PartContainer>
);

const GroupPart = ({ name, exerciseCount, groupProjectCount }: CoursePartGroup) => (
  <PartContainer name={name} count={exerciseCount}>
    Project exercises: {groupProjectCount}
  </PartContainer>
);

const BackgroundPart = ({ name, exerciseCount, description, backgroundMaterial }: CoursePartBackground) => (
  <PartContainer name={name} count={exerciseCount}>
    {description}<br />
    Background material: {backgroundMaterial}
  </PartContainer>
);

const SpecialPart = ({ name, exerciseCount, description, requirements }: CoursePartSpecial) => (
  <PartContainer name={name} count={exerciseCount}>
    {description}<br />
    Required skills: {requirements.join(", ")}
  </PartContainer>
);

const Part = (part: CoursePart) => {
  switch (part.kind) {
    case "basic":
      return <BasicPart {...part} />;
    case "group":
      return <GroupPart {...part} />;
    case "background":
      return <BackgroundPart {...part} />;
    case "special":
      return <SpecialPart {...part} />;
    default:
      return assertNever(part);
  }
};


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