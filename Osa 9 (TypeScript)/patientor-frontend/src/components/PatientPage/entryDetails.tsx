import {
  Entry,
  EntryType,
  Diagnosis
} from "../../types";
import { HospitalEntryDetails } from "./entryHospitalDetails";
import { OccupationalHealthcareEntryDetails } from "./entryOccupationalDetails";
import { HealthCheckEntryDetails } from "./entryHealthCheckDetails";

import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";


const entryIcons: Record<EntryType, JSX.Element> = {
  [EntryType.Hospital]: <LocalHospitalIcon />,
  [EntryType.HealthCheck]: <MonitorHeartIcon />,
  [EntryType.OccupationalHealthcare]: <WorkIcon />
};

const EntryIcon = ({ entry }: { entry: Entry }) => entryIcons[entry.type];


export type EntryProps<T extends Entry> = {
  entry: T;
  diagnoses: Diagnosis[];
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<{ entry: Entry; diagnoses: Diagnosis[] }> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case EntryType.Hospital:
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;

    case EntryType.HealthCheck:
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;

    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;

    default:
      return assertNever(entry);
  }
};

export const BaseEntry: React.FC<{ entry: Entry; diagnoses: Diagnosis[]; employerName?: string; children?: React.ReactNode; }> = ({ entry, diagnoses, employerName, children }) => {
  return (
    <div className="entry-box">
      <h4>
        {entry.date} &nbsp;
        <EntryIcon entry={entry} />
        {employerName && ` — ${employerName}`}
      </h4>

      <p>{entry.description}</p>

      {children && <div className="mt-2">{children}</div>}

      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map(code => {
            const diagnosis = diagnoses.find(d => d.code === code);
            return (
              <li key={code}>
                {code} {diagnosis?.name ?? "(Unknown code)"}
              </li>
            );
          })}
        </ul>
      )}

      <p>
        <i>Diagnose by {entry.specialist}</i>
      </p>
    </div>
  );
};


export default EntryDetails;
