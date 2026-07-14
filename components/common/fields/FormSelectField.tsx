"use client";

import { ReactNode, useMemo, useState } from "react";
import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
  isSearchable?: boolean;
  searchPlaceholder?: string;
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
  isSearchable = false,
  searchPlaceholder = "Search...",
}: FormSelectFieldProps<T>) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!isSearchable) return options;
    const normalized = search.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalized),
    );
  }, [options, search, isSearchable]);

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
            onOpenChange={(open) => {
              if (!open) setSearch("");
            }}
          >
            <FormControl>
              <SelectTrigger className="bg-background border-border text-foreground text-[13px] h-9 w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="h-auto max-h-72">
              {isSearchable && (
                <div className="sticky -top-2.5 z-10 -mx-1 -mt-1 mb-1 bg-popover px-2 pt-2 pb-1.5 border-b border-border">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      placeholder={searchPlaceholder}
                      className="h-8 pl-7 text-xs"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              {filteredOptions.length ? (
                filteredOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <OptionContent option={opt} />
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  {search ? "No matches found." : emptyMessage}
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
