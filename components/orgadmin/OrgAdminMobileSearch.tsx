import { SearchIcon } from "lucide-react";

type OrgAdminMobileSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export const OrgAdminMobileSearch = ({
  value,
  onChange,
}: OrgAdminMobileSearchProps) => (
  <div className="relative w-full">
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search members…"
      className="w-full py-2 pl-8 pr-3 text-[12.5px] border border-border rounded-[7px] bg-input text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
    />
    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground flex pointer-events-none">
      <SearchIcon strokeWidth={1.8} className="h-3.5 w-3.5" />
    </span>
  </div>
);
