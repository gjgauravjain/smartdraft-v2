import { TeamType } from "@/app/api/type/common";
import { useState } from "react";

export function TeamAvatar({
  team,
  size = 20,
}: {
  team?: TeamType;
  size?: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = team?.image && !imgFailed;

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-muted"
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={team!.image}
          alt={team?.shortName ?? team?.teamNames ?? ""}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span
          className="font-bold text-muted-foreground"
          style={{ fontSize: size * 0.35 }}
        >
          {(team?.shortName ?? team?.teamNames ?? "?")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      )}
    </div>
  );
}
