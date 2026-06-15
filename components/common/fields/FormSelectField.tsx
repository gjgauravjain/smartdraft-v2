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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string;
  icon?: string | ReactNode;
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function OptionIcon({ icon }: { icon: string | ReactNode }) {
  if (typeof icon === "string") {
    return (
      <img
        src={icon}
        alt=""
        className="w-4 h-4 rounded-sm object-contain shrink-0"
      />
    );
  }

  return (
    <span className="w-4 h-4 flex items-center justify-center shrink-0">
      {icon}
    </span>
  );
}

function OptionContent({ option }: { option: SelectOption }) {
  if (!option.icon) {
    return <span>{option.label}</span>;
  }

  return (
    <span className="flex items-center gap-2">
      <OptionIcon icon={option.icon} />
      <span>{option.label}</span>
    </span>
  );
}

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  disabled,
  className,
}: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-[11.5px] font-bold text-foreground uppercase tracking-wide">
            {label}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="bg-background border-border text-foreground text-[13px] h-9 w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="h-auto max-h-60">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <OptionContent option={opt} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
