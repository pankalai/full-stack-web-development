import React from "react";
import { HealthCheckRating } from "../../types";
import { FormLabel, Input } from "../../ui/index";

interface Props {
  healthCheckRating: HealthCheckRating;
  onRatingChange: (value: HealthCheckRating) => void;
}

const HealthCheckSection = ({ healthCheckRating, onRatingChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRatingChange(Number(e.target.value) as HealthCheckRating);
  };

  return (
    <div className="mb-2">
      <FormLabel className="mr-2 font-medium">Health Check Rating (0–3):</FormLabel>
      <Input
        type="number"
        inputProps={{ min: 0, max: 3 }}
        value={healthCheckRating}
        onChange={handleChange}
        required
        className="bg-white"
      />
    </div>
  );
};

export default HealthCheckSection;
