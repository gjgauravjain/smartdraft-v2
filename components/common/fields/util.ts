import { SelectOption } from "./FormSelectField";

export const visibleSelectOptions = (
  options: SelectOption[],
  search: string,
  selectedValue: string,
  isSearchable: boolean,
) => {
  const normalized = search.trim().toLowerCase();
  if (!isSearchable || !normalized) return options;

  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(normalized),
  );
  if (
    !selectedValue ||
    matches.some((option) => option.value === selectedValue)
  ) {
    return matches;
  }

  const selected = options.find((option) => option.value === selectedValue);
  return selected ? [selected, ...matches] : matches;
};
