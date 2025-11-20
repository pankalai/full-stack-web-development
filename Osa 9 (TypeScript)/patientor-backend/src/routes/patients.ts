import express, { NextFunction, Request, Response } from 'express';
import patientService from '../services/patientService';
import { NonSensitivePatient } from '../types';
import { NewPatientSchema } from '../utils';

import { z } from 'zod';
import { NewPatient, Patient } from '../types';

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    console.log(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    console.error(error.issues);
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req: Request, res: Response<Patient | { error: string }>) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);
  

export default router;