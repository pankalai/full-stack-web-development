import { NewPatientEntry, Gender } from "./types";
import { z } from 'zod';

export const NewPatientSchema = z.object({
    name: z.string().min(1, { message: 'Name cannot be empty' }),
    dateOfBirth: z.string().refine((d) => !Number.isNaN(Date.parse(d)), { message: 'Invalid date' }),
    ssn: z.string().min(1, { message: 'SSN cannot be empty' }),
    gender: z.enum(Gender),
    occupation: z.string().min(1, { message: 'Occupation cannot be empty' })
});

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
    return NewPatientSchema.parse(object);
};