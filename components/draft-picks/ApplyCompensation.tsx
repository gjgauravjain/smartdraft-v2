import React from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type ApplyCompensationProps = {
  applyCompensation?: boolean;
  onApplyCompensation?: (v: boolean) => void;
};
const ApplyCompensation = ({
  applyCompensation,
  onApplyCompensation,
}: ApplyCompensationProps) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-sm">
      <Switch
        id="compensation"
        checked={applyCompensation}
        onCheckedChange={onApplyCompensation}
      />
      <Label
        htmlFor="compensation"
        className="cursor-pointer whitespace-nowrap text-sm text-foreground"
      >
        Apply compensation picks
      </Label>
    </div>
  );
};

export default ApplyCompensation;
