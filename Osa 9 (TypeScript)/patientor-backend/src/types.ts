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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Entry {
}

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[]
};

type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

type NewPatient = z.infer<typeof NewPatientSchema>;

export { Diagnosis, Patient, NonSensitivePatient, NewPatient, Gender, Entry };