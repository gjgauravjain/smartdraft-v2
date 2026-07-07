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
import RequiredLabel from "./RequiredLabel";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  className,
  required,
}: FormTextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? (
            <FormLabel className="text-[11.5px] font-bold text-foreground uppercase tracking-wide">
              <RequiredLabel showRequired={required}>{label}</RequiredLabel>
            </FormLabel>
          ) : null}
          <FormControl>
            <Input
              placeholder={placeholder}
              disabled={disabled}
              className="bg-background border-border text-foreground text-[13px] h-9"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
