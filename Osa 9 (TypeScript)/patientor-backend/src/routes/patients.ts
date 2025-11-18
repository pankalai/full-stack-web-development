import express from 'express';
import patientService from '../services/patientService';
import { NonSensitivePatient } from '../types';
import { toNewPatientEntry } from '../services/utils';

const router = express.Router();

router.get('/', (_req, res: express.Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});


router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(400).send("Unknown error");
    }
  }
});

export default router;