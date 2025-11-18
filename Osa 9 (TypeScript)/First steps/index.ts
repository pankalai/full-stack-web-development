import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (!height || !weight || isNaN(height) || isNaN(weight)) {
        res.status(400).send({ error: 'malformatted parameters' });
    }
    else {
        res.send({
            weight: weight,
            height: height,
            bmi: calculateBmi(height, weight)
        });
    }
});

app.post('/exercises', (req, res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { daily_exercises, target } = req.body;
        if (!daily_exercises || !target) {
            res.status(400).send({ error: 'parameters missing' });
        }
        else if (!Array.isArray(daily_exercises) || daily_exercises.some((n) => isNaN(Number(n))) 
            || isNaN(Number(target))) {
            res.status(400).send({ error: 'malformatted parameters' });
        } else {
            res.send(calculateExercises(daily_exercises.map(Number), Number(target)));
        }
    });

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});