import { useGetTeams } from "@/app/api/react-query/common";
import { OrgDetailsType } from "@/app/api/type/organisation";
import { useIsMobile } from "@/hooks/use-mobile";
import { getInitials } from "@/lib/utils";
import { InfoItem, MobileInfoItem } from "./InfoItem";

interface OrgInfoCardProps {
  organisation: OrgDetailsType;
}

export function OrgInfoCard({ organisation }: OrgInfoCardProps) {
  const isMobile = useIsMobile();

  const { data } = useGetTeams();

  const flag = data?.find(
    (item) => item.id.toString() === organisation.id.toString(),
  );

  const logo = flag?.image;
  const initials = getInitials(organisation.name);

  if (isMobile) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-[13px] border border-border bg-muted text-[21px] font-bold tracking-[0.3px] text-muted-foreground">
            {logo ? (
              <img
                src={logo}
                alt={organisation.name}
                className="h-full w-full rounded-[13px] object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <h2 className="text-center text-[17px] font-bold text-foreground">
            {organisation.name}
          </h2>

          <div className="mt-1 flex w-full border-t border-border pt-3">
            <MobileInfoItem
              label="Team"
              value={organisation.defaultTeam?.name ?? "-"}
            />

            <MobileInfoItem
              label="Members"
              value={`${organisation.members ?? 0}`}
              bordered
            />

            <MobileInfoItem label="Created" value="-" bordered />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-[18px]">
        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[14px] border border-border bg-muted text-[22px] font-bold tracking-[0.3px] text-muted-foreground">
          {logo ? (
            <img
              src={logo}
              alt={organisation.name}
              className="h-full w-full rounded-[14px] object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-[20px] font-bold tracking-[-0.3px] text-foreground">
            {organisation.name}
          </h2>

          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-4">
            <InfoItem
              label="Sporting Code"
              value={organisation.sportingCode?.name ?? "-"}
            />

            <InfoItem
              label="Default Team"
              value={organisation.defaultTeam?.name ?? "-"}
            />

            <InfoItem
              label="Members"
              value={`${organisation.members ?? 0} users`}
            />

            <InfoItem label="Created" value="-" />
          </div>
        </div>
      </div>
    </div>
  );
}
