import { FormLabel, Input } from "../../ui/index";

interface Props {
  employerName: string;
  sickLeaveStart: string;
  sickLeaveEnd: string;
  onEmployerChange: (value: string) => void;
  onSickLeaveStartChange: (value: string) => void;
  onSickLeaveEndChange: (value: string) => void;
}

const OccupationalHealthcareSection = ({
  employerName,
  sickLeaveStart,
  sickLeaveEnd,
  onEmployerChange,
  onSickLeaveStartChange,
  onSickLeaveEndChange
}: Props) => {
  return (
    <>
      <div className="mb-2">
        <FormLabel className="mr-2 font-medium">Employer name:</FormLabel>
        <Input
          value={employerName}
          onChange={e => onEmployerChange(e.target.value)}
          required
          className="border rounded p-1"
        />
      </div>

      <h4 className="mt-3 mb-1 font-semibold">Sick Leave (optional)</h4>

      <div className="mb-2">
        <FormLabel className="mr-2">Start:</FormLabel>
        <Input
          type="date"
          value={sickLeaveStart}
          onChange={e => onSickLeaveStartChange(e.target.value)}
          className="border rounded p-1"
        />
      </div>

      <div className="mb-2">
        <FormLabel className="mr-2">End:</FormLabel>
        <Input
          type="date"
          value={sickLeaveEnd}
          onChange={e => onSickLeaveEndChange(e.target.value)}
          className="border rounded p-1"
        />
      </div>
    </>
  );
};

export default OccupationalHealthcareSection;
