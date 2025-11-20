// src/components/PatientPage/index.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import { Patient } from '../../types';
import axios from 'axios';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    patientService.getById(id)
      .then(p => {
          setPatient(p);
          setError(null);
      })
      .catch(err => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || String(err.message));
        } else {
          setError('Unknown error while fetching patient');
        }
      })
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) return <div>Loading patient...</div>;
  if (error) return <div style={{ color: 'red' }}><h3>{error}</h3></div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div>
      <h2>{patient.name} {patient.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}</h2>
      <div>SSN: {patient.ssn}</div>
      <div>Occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientPage;