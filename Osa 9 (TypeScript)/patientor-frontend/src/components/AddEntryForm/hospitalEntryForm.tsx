import { FormLabel, Input } from "../../ui/index";

interface Props {
  dischargeDate: string;
  dischargeCriteria: string;
  onDischargeDateChange: (value: string) => void;
  onDischargeCriteriaChange: (value: string) => void;
}

const HospitalSection = ({
  dischargeDate,
  dischargeCriteria,
  onDischargeDateChange,
  onDischargeCriteriaChange,
}: Props) => {
  return (
    <>
      <h4 className="mt-3 mb-1 font-semibold">Discharge</h4>

      <div className="mb-2">
        <FormLabel className="mr-2">Date:</FormLabel>
        <Input
          type="date"
          value={dischargeDate}
          onChange={e => onDischargeDateChange(e.target.value)}
          required
          className="border rounded p-1"
        />
      </div>

      <div className="mb-2">
        <FormLabel className="mr-2">Criteria:</FormLabel>
        <Input
          value={dischargeCriteria}
          onChange={e => onDischargeCriteriaChange(e.target.value)}
          required
          className="border rounded p-1"
        />
      </div>
    </>
  );
};

export default HospitalSection;
