interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseArgumentsExercises = (args: string[]): { dailyExercises: number[], target: number } => {
    if (args.length < 4) throw new Error('Not enough arguments');
    const target = Number(args[2]);
    const dailyExercises = args.slice(3).map(Number);
    if (isNaN(target) || dailyExercises.some(isNaN)) {
        throw new Error('Provided values were not numbers!');
    }
    return {
        dailyExercises,
        target
    };
};

export const calculateExercises = (dailyExercises: number[], target: number): Result => {
    const periodLength = dailyExercises.length;
    const trainingDays = dailyExercises.filter(day => day > 0).length;
    const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
    const average = totalHours / periodLength;
    const success = average >= target;
    const rating = success ? 3 : average >= target / 2 ? 2 : 1;
    const ratingDescription = rating === 3 ? 'great job, you met your target!' :
                              rating === 2 ? 'not too bad but could be better' :
                              'bad';
    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: average
    };
};

if (require.main === module) {
    try {
        const { dailyExercises, target } = parseArgumentsExercises(process.argv);
        console.log(calculateExercises(dailyExercises, target));
    } catch (e) {
        if (e instanceof Error) {
            console.log('Error:', e.message);
        }
    }
}