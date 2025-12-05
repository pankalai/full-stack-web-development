import { HealthCheckEntry, HealthCheckRating } from "../../types";
import { BaseEntry, EntryProps } from "./entryDetails";

import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";


const healthIcons: Record<HealthCheckRating, JSX.Element> = {
  [HealthCheckRating.Healthy]: <SentimentVerySatisfiedIcon />,
  [HealthCheckRating.LowRisk]: <SentimentSatisfiedAltIcon />,
  [HealthCheckRating.HighRisk]: <SentimentDissatisfiedIcon />,
  [HealthCheckRating.CriticalRisk]: <SentimentVeryDissatisfiedIcon />
};

const HealthCheckIcon = ({ rating }: { rating: HealthCheckRating }) => healthIcons[rating];
    

export const HealthCheckEntryDetails: React.FC<EntryProps<HealthCheckEntry>> = ({ entry, diagnoses }) => (
  <BaseEntry entry={entry} diagnoses={diagnoses}>
    <HealthCheckIcon rating={entry.healthCheckRating} />
  </BaseEntry>
);