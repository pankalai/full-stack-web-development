import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import { Patient, Gender, FormValues, EntryType, Diagnosis } from "../../types";
import EntryDetails from "./entryDetails";
import EntryForm from "../AddEntryForm";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Button } from "@mui/material";
import axios from "axios";

interface BackendError {
  code: string;
  path: string[];
  message: string;
  values?: (string | number)[];
}

type ActiveForm = "healthcheck" | "occupational" | "hospital" | null;

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    patientService.getById(id)
      .then(p => setPatient(p))
      .catch(err => setError(err instanceof Error ? err.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const allDiagnoses = await diagnoseService.getAllDiagnoses();
        setDiagnoses(allDiagnoses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchDiagnoses();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (entryError) {
      const timer = setTimeout(() => setEntryError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [entryError]);


  const handleAddEntry = useCallback(async (entry: FormValues) => {
    if (!patient) return;

    try {
      const addedEntry = await patientService.addEntry(patient.id, entry);
      setPatient(prev => prev ? { ...prev, entries: [...prev.entries, addedEntry] } : prev);
      setActiveForm(null);
    } catch (err: unknown) {
      let message = "Unknown error while adding entry";

      if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        if (data && Array.isArray(data.error)) {
          const errorMessages = (data.error as BackendError[]).map(errorItem => {
            const field = errorItem.path?.join(".") || "unknown";
            const key = errorItem.path?.[0] as keyof FormValues;
            const invalidValue = key && entry[key];
            const allowed = errorItem.values ? `, allowed: ${errorItem.values.join(", ")}` : "";
            return `Invalid value for ${field}: ${invalidValue}${allowed}`;
          });
          message = errorMessages.join("; ");
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setEntryError(message);
    }
  }, [patient]);

  if (loading) return <div>Loading patient...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div>
      <h2>
        {patient.name} {patient.gender === Gender.Male ? <MaleIcon /> : <FemaleIcon />}
      </h2>
      <div>SSN: {patient.ssn}</div>
      <div>Occupation: {patient.occupation}</div>

      <div style={{ margin: "16px 0" }}>
        {activeForm === null && (
          <div>
            <Button variant="contained" color="primary" onClick={() => setActiveForm("healthcheck")}>
              HealthCheck Entry
            </Button>
            &nbsp;
            <Button variant="contained" color="primary" onClick={() => setActiveForm("occupational")}>
              Occupational Entry
            </Button>
            &nbsp;
            <Button variant="contained" color="primary" onClick={() => setActiveForm("hospital")}>
              Hospital Entry
            </Button>
          </div>
        )}

        {entryError && <div style={{ color: "red", marginBottom: 10 }}>{entryError}</div>}

        {activeForm && (
          <EntryForm
            type={
              activeForm === "healthcheck"
                ? EntryType.HealthCheck
                : activeForm === "occupational"
                ? EntryType.OccupationalHealthcare
                : EntryType.Hospital
            }
            onSubmit={handleAddEntry}
            onCancel={() => setActiveForm(null)}
            diagnoses={diagnoses}
          />
        )}

      </div>

      <div>
        <h3>Entries</h3>
        {!patient.entries || patient.entries.length === 0 ? (
          <div>No entries</div>
        ) : (
          <ul>
            {patient.entries.map(entry => (
              <li key={entry.id}>
                <EntryDetails entry={entry} diagnoses={diagnoses} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientPage;
