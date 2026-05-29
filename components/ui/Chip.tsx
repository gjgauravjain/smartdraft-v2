import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex max-w-full items-center overflow-hidden whitespace-nowrap rounded-full border px-[7px] py-[2px] text-[10.5px] font-semibold leading-none",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-muted-foreground",
        success:
          "border-success-border-muted bg-success-surface-muted text-success-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ className, variant, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...props}>
      <span className="truncate">{children}</span>
    </span>
  );
}
