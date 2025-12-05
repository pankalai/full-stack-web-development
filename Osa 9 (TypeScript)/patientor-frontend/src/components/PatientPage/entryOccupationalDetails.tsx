import { OccupationalHealthcareEntry } from "../../types";
import { BaseEntry, EntryProps} from "./entryDetails";


export const OccupationalHealthcareEntryDetails: React.FC<EntryProps<OccupationalHealthcareEntry>> = ({ entry, diagnoses }) => (
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
