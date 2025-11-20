import data from '../../data/patients';
import { NonSensitivePatient, NewPatient, Patient } from '../types';
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
  const newPatient: Patient = {
    id: uuidv4(),
    entries: [],
    ...patient
  };
  data.push(newPatient);
  return newPatient;
};


export default {
  getPatients,
  getPatientById,
  addPatient
};