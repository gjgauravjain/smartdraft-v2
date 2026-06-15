import { InfoIcon } from "lucide-react";

export function InfoBanner() {
  return (
    <div className="flex gap-2.25 items-start px-3.25 py-2.75 rounded-lg bg-sub-heading/10 border border-transparent">
      <InfoIcon
        size={15}
        strokeWidth={1.8}
        className="text-sub-heading shrink-0 mt-px"
      />
      <span className="text-xs text-muted-foreground leading-normal">
        The new org starts <strong className="text-foreground">empty</strong>.
        You&apos;ll add and link users from its detail page.
      </span>
    </div>
  );
}
