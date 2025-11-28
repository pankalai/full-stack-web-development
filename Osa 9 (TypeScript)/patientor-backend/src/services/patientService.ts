import data from '../../data/patients';
import { 
  NonSensitivePatient, 
  NewPatient, 
  Patient, 
  Entry, 
  EntryType,
  NewEntry,
  Diagnosis
} from '../types';
import { v4 as uuidv4 } from 'uuid';


const getPatients = (): NonSensitivePatient[] => {
  return data.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};
 
const getPatientById = (id: string): Patient | undefined => {
  return data.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  if (patient.entries && Array.isArray(patient.entries)) {
    patient.entries.forEach((entry: NewEntry) => {
      if (!Object.values(EntryType).includes(entry.type)) {
        throw new Error(`Invalid entry type: ${entry.type}`);
      }
    });
  }
  
  const entriesWithIds: Entry[] = patient.entries && Array.isArray(patient.entries)
    ? patient.entries.map((entry: NewEntry) => ({ id: uuidv4(), ...entry }))
    : [];

  const newPatient: Patient = {
    id: uuidv4(),
    ...patient,
    entries: entriesWithIds
  };
  data.push(newPatient);
  return newPatient;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }
  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const addEntry = (id: string, entry: NewEntry): Entry => {
  const diagnosisCodes = entry.diagnosisCodes
    ? parseDiagnosisCodes(entry)
    : undefined;

  const newEntry: Entry = {
    id: uuidv4(),
    ...entry,
    diagnosisCodes
  } as Entry;

  const patient = data.find(p => p.id === id);
  if (!patient) {
    throw new Error(`Patient with id ${id} not found`);
  }

  patient.entries = patient.entries ?? [];
  patient.entries.push(newEntry);
  return newEntry;
};



export default {
  getPatients,
  getPatientById,
  addPatient,
  addEntry
};