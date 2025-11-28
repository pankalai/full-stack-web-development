import { NewPatient, Gender, EntryType, HealthCheckRating } from "./types";
import { z } from 'zod';

export const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.enum(HealthCheckRating, { message: 'Value of HealthCheckRating incorrect'})
});

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string().date(),
    endDate: z.string().date()
  }).optional()
});

export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string()
  })
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema
]);

export const NewPatientSchema = z.object({
    name: z.string().min(1, { message: 'Name cannot be empty' }),
    dateOfBirth: z.string()
        .refine((d) => !Number.isNaN(Date.parse(d)), { message: 'Invalid date' }),
    ssn: z.string().min(1, { message: 'SSN cannot be empty' }),
    gender: z.enum(Gender),
    occupation: z.string().min(1, { message: 'Occupation cannot be empty' }),
    entries: z.array(NewEntrySchema).optional()
});

export const toNewPatient = (object: unknown): NewPatient => {
    return NewPatientSchema.parse(object);
};