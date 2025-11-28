import { useState } from "react";
import {
  EntryType,
  FormValues,
  HealthCheckRating,
  Diagnosis
} from "../../types";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Checkbox from "@mui/material/Checkbox/Checkbox";

const ITEM_HEIGHT = 28;
const ITEM_PADDING_TOP = 1;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
      style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}
    >
      <h3>New {type} Entry</h3>

      <div>
        <label>Description:</label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Specialist:</label>
        <input
          value={specialist}
          onChange={e => setSpecialist(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Diagnosis:</label>
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
        <div>
          <label>Health Check Rating (0–3):</label>
          <input
            type="number"
            min={0}
            max={3}
            value={healthCheckRating}
            onChange={e =>
              setHealthCheckRating(Number(e.target.value) as HealthCheckRating)
            }
            required
          />
        </div>
      )}

      {type === EntryType.OccupationalHealthcare && (
        <>
          <div>
            <label>Employer name:</label>
            <input
              value={employerName}
              onChange={e => setEmployerName(e.target.value)}
              required
            />
          </div>

          <h4>Sick Leave (optional)</h4>
          <div>
            <label>Start:</label>
            <input
              type="date"
              value={sickLeaveStart}
              onChange={e => setSickLeaveStart(e.target.value)}
            />
          </div>

          <div>
            <label>End:</label>
            <input
              type="date"
              value={sickLeaveEnd}
              onChange={e => setSickLeaveEnd(e.target.value)}
            />
          </div>
        </>
      )}

      {type === EntryType.Hospital && (
        <>
          <h4>Discharge</h4>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={dischargeDate}
              onChange={e => setDischargeDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Criteria:</label>
            <input
              value={dischargeCriteria}
              onChange={e => setDischargeCriteria(e.target.value)}
              required
            />
          </div>
        </>
      )}


      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EntryForm;
