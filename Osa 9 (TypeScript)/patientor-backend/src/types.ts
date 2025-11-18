import { z } from 'zod';
import { NewPatientSchema } from './utils';

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
};

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
};

type NonSensitivePatient = Omit<Patient, 'ssn'>;

type NewPatientEntry = z.infer<typeof NewPatientSchema>;

export { Diagnosis, Patient, NonSensitivePatient, NewPatientEntry, Gender };