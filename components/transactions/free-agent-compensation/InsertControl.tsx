"use client";

import RequiredLabel from "@/components/common/fields/RequiredLabel";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { FreeAgentCompensationFormValues } from "./type";

type InsertControlProps = {
  control: Control<FreeAgentCompensationFormValues>;
};

export const InsertControl = ({ control }: InsertControlProps) => {
  return (
    <FormField
      control={control}
      name="insert"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-[11.5px] font-bold uppercase tracking-wide text-foreground">
            <RequiredLabel>Insert</RequiredLabel>
          </FormLabel>
          <FormControl>
            <div
              className={cn(
                "grid h-[34px] grid-cols-2 overflow-hidden rounded-[7px] border bg-card",
                fieldState.error ? "border-destructive" : "border-border",
              )}
            >
              <InsertButton
                label="Before"
                selected={field.value === "Before"}
                onSelect={() => field.onChange("Before")}
              />
              <InsertButton
                label="After"
                selected={field.value === "After"}
                onSelect={() => field.onChange("After")}
                className="border-l border-border"
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

const InsertButton = ({
  label,
  selected,
  onSelect,
  className,
}: {
  label: "Before" | "After";
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "text-[13px] font-semibold",
        selected
          ? "bg-highlight-background text-highlight-text"
          : "bg-card text-foreground",
        className,
      )}
    >
      {label}
    </button>
  );
};
