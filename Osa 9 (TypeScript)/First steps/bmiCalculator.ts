interface BmiValues {
    height: number;
    weight: number;
}

const parseArgumentsBmi = (args: string[]): BmiValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            height: Number(args[2]),
            weight: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

export const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / ((height / 100) * (height / 100));
  switch (true) {
    case bmi < 16.0:
      return 'Underweight (Severe thinness)';
    case bmi >= 16.0 && bmi < 17.0:
        return 'Underweight (Moderate thinness)';
    case bmi >= 17.0 && bmi < 18.5:
      return 'Underweight (Mild thinness)';
    case bmi >= 18.5 && bmi < 25:
      return 'Normal range';
    case bmi >= 25 && bmi < 30:
      return 'Overweight (Pre-obese)';
    case bmi >= 30 && bmi < 35:
      return 'Obese (Class I)';
    case bmi >= 35 && bmi < 40:
      return 'Obese (Class II)';
    case bmi >= 40:
        return 'Obese (Class III)';
    default:
      return 'Obese';
  }
};

if (require.main === module) {
    try {
        const { height, weight } = parseArgumentsBmi(process.argv);
        console.log(calculateBmi(height, weight));
    } catch (e) {
        if (e instanceof Error) {
            console.log('Error:', e.message);
        }
    }
}