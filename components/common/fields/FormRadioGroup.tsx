"use client";

import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import RequiredLabel from "./RequiredLabel";

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  variant?: "default" | "warning";
}

interface FormRadioGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
  required?: boolean;
  layout?: "card" | "inline";
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled,
  className,
  required,
  layout = "card",
}: FormRadioGroupProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? (
            <FormLabel className="text-[11.5px] font-bold uppercase tracking-wide text-foreground">
              <RequiredLabel showRequired={required}>{label}</RequiredLabel>
            </FormLabel>
          ) : null}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
              className={cn(
                layout === "card" ? "flex flex-col gap-2" : "flex flex-row gap-4",
              )}
            >
              {options.map((option) => {
                const optionId = `${String(name)}-${option.value}`;
                const isSelected = field.value === option.value;
                const isWarning = option.variant === "warning";

                if (layout === "inline") {
                  return (
                    <label
                      key={option.value}
                      htmlFor={optionId}
                      className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-foreground"
                    >
                      <RadioGroupItem id={optionId} value={option.value} />
                      {option.label}
                    </label>
                  );
                }

                return (
                  <label
                    key={option.value}
                    htmlFor={optionId}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-secondary/40",
                      isWarning &&
                        isSelected &&
                        "border-destructive/40 bg-destructive/5",
                      disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <RadioGroupItem
                      id={optionId}
                      value={option.value}
                      disabled={disabled}
                      className="mt-0.5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                        {isWarning && (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                        )}
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
