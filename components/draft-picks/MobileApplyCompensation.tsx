"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface MobileApplyCompensationProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function MobileApplyCompensation({
  checked,
  onCheckedChange,
}: MobileApplyCompensationProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-3.5 py-2">
      <Label
        htmlFor="mobile-compensation"
        className="cursor-pointer text-[11.5px] font-medium text-muted-foreground"
      >
        Apply compensation picks
      </Label>

      <Switch
        id="mobile-compensation"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
