"use client";

import { ReactNode } from "react";
import { Control, FieldValues, FieldPath } from "react-hook-form";
import {
  FormControl,
  FormDescription,
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
import RequiredLabel from "./RequiredLabel";

export interface SelectOption {
  label: string;
  value: string;
  icon?: string | ReactNode;
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
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
  description,
  emptyMessage = "No options available.",
  disabled,
  className,
  required,
}: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-[11.5px] font-bold text-foreground uppercase tracking-wide [&_*]:normal-case [&_*]:tracking-normal">
            <RequiredLabel showRequired={required}>{label}</RequiredLabel>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || undefined}
            disabled={disabled || options.length === 0}
          >
            <FormControl>
              <SelectTrigger className="bg-background border-border text-foreground text-[13px] h-9 w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="h-auto max-h-60">
              {options.length ? (
                options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <OptionContent option={opt} />
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  {emptyMessage}
                </div>
              )}
            </SelectContent>
          </Select>
          {description && (
            <FormDescription className="text-[11px] leading-[1.4]">
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
