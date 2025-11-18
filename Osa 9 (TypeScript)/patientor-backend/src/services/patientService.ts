import data from '../../data/patients';
import { NonSensitivePatient, NewPatientEntry, Patient } from '../types';
import { v4 as uuidv4 } from 'uuid';


const getPatients = (): NonSensitivePatient[] => {
  return data.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};
 
const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuidv4(),
    ...entry
  };
  data.push(newPatient);
  return newPatient;
};


export default {
  getPatients,
  addPatient
};