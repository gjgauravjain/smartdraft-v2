type SportingCodeBadgeProps = {
  name: string;
};

export const SportingCodeBadge = ({ name }: SportingCodeBadgeProps) => (
  <span className="px-2 py-0.5 rounded  border border-border text-[10.5px] font-bold text-muted-foreground">
    {name}
  </span>
);
