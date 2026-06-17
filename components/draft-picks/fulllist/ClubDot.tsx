import { TeamType } from "@/app/api/type/common";

type Props = {
  teams: TeamType[];
  teamId: string;
};

const ClubDot = ({ teams, teamId }: Props) => {
  const findTeam = teams.find(
    (team) => team.id.toString() === teamId.toString(),
  );
  return (
    <div className="h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {findTeam?.image && (
        <img
          src={findTeam?.image}
          alt={findTeam?.shortName}
          className="h-full w-full object-cover rounded-2xl"
        />
      )}
    </div>
  );
};

export default ClubDot;
