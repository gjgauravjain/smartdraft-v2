"use client";

import { ReactNode } from "react";
import { Control, FieldValues, FieldPath } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import RequiredLabel from "./RequiredLabel";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  italiseLabel?: boolean;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  className,
  required,
  italiseLabel,
}: FormTextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? (
            <FormLabel
              className={cn(
                "text-[11.5px] font-bold text-foreground uppercase tracking-wide",
                italiseLabel && "italic",
              )}
            >
              <RequiredLabel showRequired={required}>{label}</RequiredLabel>
            </FormLabel>
          ) : null}
          <FormControl>
            <Input
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "bg-background border-border text-foreground text-[13px] h-9",
                italiseLabel && "placeholder:italic",
              )}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
