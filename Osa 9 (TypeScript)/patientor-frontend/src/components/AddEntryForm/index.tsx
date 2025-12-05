import { useState } from "react";
import {
  EntryType,
  FormValues,
  HealthCheckRating,
  Diagnosis
} from "../../types";
import OccupationalHealthcareSection from "./occupationalEntryForm";
import HospitalSection from "./hospitalEntryForm";
import HealthCheckSection from "./healthCheckEntryForm";

import { FormLabel, Input, Button, Select, SelectChangeEvent, MenuItem, Checkbox, ListItemText, MenuProps } from "../../ui/index";
import { toSentenceFromCase } from "../../utils";

interface Props {
  type: EntryType;       
  onSubmit: (entry: FormValues) => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
}

const EntryForm = ({ type, onSubmit, onCancel, diagnoses }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const handleDiagnosisCodeChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseFields = {
      type,
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined};

    let entry: FormValues;

    switch (type) {
      case EntryType.HealthCheck:
        entry = {...baseFields, type: EntryType.HealthCheck, healthCheckRating};
        break;

      case EntryType.OccupationalHealthcare:
        entry = {...baseFields, type: EntryType.OccupationalHealthcare, employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd
                }
              : undefined
        };
        break;

      case EntryType.Hospital:
        entry = {...baseFields, type: EntryType.Hospital, discharge: {date: dischargeDate, criteria: dischargeCriteria}};
        break;

      default:
        throw new Error("Unknown entry type");
    }

    onSubmit(entry);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ border: "1px solid #ccc", padding: 20, marginTop: 5 }}
    >
      <h3>{toSentenceFromCase(type)} entry</h3>

      <div>
        <FormLabel>Description:</FormLabel>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <FormLabel>Date:</FormLabel>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <FormLabel>Specialist:</FormLabel>
        <Input
          value={specialist}
          onChange={e => setSpecialist(e.target.value)}
          required
        />
      </div>

      <div>
        <FormLabel>Diagnosis:</FormLabel>
        <Select
          multiple
          size="small"
          value={diagnosisCodes}
          onChange={handleDiagnosisCodeChange}
          renderValue={(selected) => selected.length === 0 ? 'codes' : selected.join(', ')}
          displayEmpty
          MenuProps={MenuProps}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={diagnosisCodes.includes(diagnosis.code)} />
              <ListItemText primary={diagnosis.code} />
            </MenuItem>
          ))}
        </Select>
      </div>


      {type === EntryType.HealthCheck && (
        <HealthCheckSection
          healthCheckRating={healthCheckRating}
          onRatingChange={setHealthCheckRating}
        />
      )}


      {type === EntryType.OccupationalHealthcare && (
        <OccupationalHealthcareSection
          employerName={employerName}
          sickLeaveStart={sickLeaveStart}
          sickLeaveEnd={sickLeaveEnd}
          onEmployerChange={setEmployerName}
          onSickLeaveStartChange={setSickLeaveStart}
          onSickLeaveEndChange={setSickLeaveEnd}
        />
      )}


      {type === EntryType.Hospital && (
        <HospitalSection
          dischargeDate={dischargeDate}
          dischargeCriteria={dischargeCriteria}
          onDischargeDateChange={setDischargeDate}
          onDischargeCriteriaChange={setDischargeCriteria}
        />
      )}

      <div style={{ marginTop: 25, display: "flex", gap: "10px" }}>
        <Button type="submit" variant="contained" color="success">Submit</Button>
        <Button type="button" onClick={onCancel} variant="contained" color="error">Cancel</Button>
      </div>

    </form>
  );
};

export default EntryForm;
