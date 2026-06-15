import { getInitials } from "@/lib/utils";

type OrgAvatarProps = {
  name: string;
};

export const OrgAvatar = ({ name }: OrgAvatarProps) => (
  <div className="w-8.5 h-8.5 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 text-foreground font-bold text-[13px] tracking-wide font-sans">
    {getInitials(name)}
  </div>
);
