import { OrganisationListType } from "@/app/api/type/organisation";
import { OrgAvatar } from "./OrgAvatar";
import { SportingCodeBadge } from "../common/SportingCodeBadge";

type OrgTableRowProps = {
  org: OrganisationListType;
  onClick: (org: OrganisationListType) => void;
  onMenuClick: (e: React.MouseEvent, org: OrganisationListType) => void;
};

const DotsIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const OrgTableRow = ({
  org,
  onClick,
  onMenuClick,
}: OrgTableRowProps) => (
  <tr onClick={() => onClick(org)}>
    <td>
      <div className="flex items-center gap-2.5">
        <OrgAvatar name={org.name} />
        <span className="text-[13.5px] font-semibold text-foreground">
          {org.name}
        </span>
      </div>
    </td>
    <td>
      <SportingCodeBadge name={org.sportingCode.name} />
    </td>
    <td className="text-[12.5px]">{org.defaultTeam.name}</td>
    <td className="text-[13px] text-center tabular-nums font-semibold">
      {"—"}
    </td>
    <td className="text-xs">{formatDate(org.createdAt)}</td>
    <td className="text-right">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick(e, org);
        }}
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors inline-flex p-1 rounded cursor-pointer"
      >
        <DotsIcon />
      </button>
    </td>
  </tr>
);
