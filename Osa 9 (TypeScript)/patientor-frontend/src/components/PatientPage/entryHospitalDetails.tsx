import { HospitalEntry } from "../../types";
import { BaseEntry, EntryProps } from "./entryDetails";

export const HospitalEntryDetails: React.FC<EntryProps<HospitalEntry>> = ({ entry, diagnoses }) => (
  <BaseEntry entry={entry} diagnoses={diagnoses}>
    <p>Discharge date: {entry.discharge.date}</p>
    <p>Discharge criteria: {entry.discharge.criteria}</p>
  </BaseEntry>
);