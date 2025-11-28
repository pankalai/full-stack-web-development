import {
  Entry,
  EntryType,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
  Diagnosis
} from "../../types";

import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const entryIcons: Record<EntryType, JSX.Element> = {
  [EntryType.Hospital]: <LocalHospitalIcon />,
  [EntryType.HealthCheck]: <MonitorHeartIcon />,
  [EntryType.OccupationalHealthcare]: <WorkIcon />
};

const healthIcons: Record<HealthCheckRating, JSX.Element> = {
  [HealthCheckRating.Healthy]: <SentimentVerySatisfiedIcon />,
  [HealthCheckRating.LowRisk]: <SentimentSatisfiedAltIcon />,
  [HealthCheckRating.HighRisk]: <SentimentDissatisfiedIcon />,
  [HealthCheckRating.CriticalRisk]: <SentimentVeryDissatisfiedIcon />
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

type EntryProps<T extends Entry> = {
  entry: T;
  diagnoses: Diagnosis[];
};

const EntryIcon = ({ entry }: { entry: Entry }) => entryIcons[entry.type];

const HealthCheckIcon = ({ rating }: { rating: HealthCheckRating }) => healthIcons[rating];

const BaseEntry: React.FC<{ entry: Entry; diagnoses: Diagnosis[]; employerName?: string; children?: React.ReactNode; }> = ({ entry, diagnoses, employerName, children }) => {
  return (
    <div className="entry-box">
      <h4>
        {entry.date}
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

const HealthCheckEntryDetails: React.FC<EntryProps<HealthCheckEntry>> = ({ entry, diagnoses }) => (
  <BaseEntry entry={entry} diagnoses={diagnoses}>
    <HealthCheckIcon rating={entry.healthCheckRating} />
  </BaseEntry>
);

const HospitalEntryDetails: React.FC<EntryProps<HospitalEntry>> = ({ entry, diagnoses }) => (
  <BaseEntry entry={entry} diagnoses={diagnoses}>
    <p>Discharge date: {entry.discharge.date}</p>
    <p>Discharge criteria: {entry.discharge.criteria}</p>
  </BaseEntry>
);

const OccupationalHealthcareEntryDetails: React.FC<EntryProps<OccupationalHealthcareEntry>> = ({ entry, diagnoses }) => (
  <BaseEntry entry={entry} diagnoses={diagnoses} employerName={entry.employerName}>
    {entry.sickLeave && (
      <div>
        <p>
          Sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
        </p>
      </div>
    )}
  </BaseEntry>
);

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

export default EntryDetails;
