import { useState, useMemo } from "react";
import { OrgTableRow } from "./OrgTableRow";
import { OrganisationListType } from "@/app/api/type/organisation";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrgMobileList } from "./OrgMobileList";

type OrgTableProps = {
  organisations: OrganisationListType[];
  onRowClick: (org: OrganisationListType) => void;
  onMenuClick: (e: React.MouseEvent, org: OrganisationListType) => void;
};

export const OrgTable = ({
  organisations,
  onRowClick,
  onMenuClick,
}: OrgTableProps) => {
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const isMobile = useIsMobile();
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return organisations
      .filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.defaultTeam.name.toLowerCase().includes(q) ||
          o.sportingCode.name.toLowerCase().includes(q),
      )
      .sort((a, b) =>
        sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
  }, [organisations, search, sortDir]);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3.5 pb-32">
        <div className="flex items-center">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.6px]">
            All organisations
          </span>
          <span className="ml-[7px] text-[11px] text-muted-foreground">
            {filtered.length} total
          </span>
        </div>

        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organisations…"
            className="w-full py-2.5 pl-[34px] pr-3 text-[13px] bg-muted border border-border rounded-[9px] text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
          <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-muted-foreground flex pointer-events-none">
            <SearchIcon size={15} />
          </span>
        </div>

        <OrgMobileList organisations={filtered} onRowClick={onRowClick} />
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center mb-3">
        <span className="text-[13.5px] font-bold text-foreground">
          All organisations
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          {filtered.length} total
        </span>
        <span className="flex-1" />
        <div className="relative w-55">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full py-1.75 pl-7.5 pr-3 text-[12.5px] border border-border rounded-[7px]  text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground flex pointer-events-none">
            <SearchIcon size={13} />
          </span>
        </div>
        <span className="w-2" />
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold rounded-md bg-card text-muted-foreground border border-border hover:bg-muted transition-colors cursor-pointer"
        >
          Sort: Name {sortDir === "asc" ? "▾" : "▴"}
        </button>
      </div>
      <div className={cn("sd-table-wrap", "mb-30")}>
        <table className="sd-table">
          <thead>
            <tr>
              <th>Organisation</th>
              <th>Sporting code</th>
              <th>Default team</th>
              <th className="center">Members</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr className="sd-table-empty">
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground border-none"
                >
                  No organisations match your search.
                </td>
              </tr>
            ) : (
              filtered.map((org) => (
                <OrgTableRow
                  key={org.id}
                  org={org}
                  onClick={onRowClick}
                  onMenuClick={onMenuClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
