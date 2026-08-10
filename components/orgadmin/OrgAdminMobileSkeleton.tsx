export const OrgAdminMobileSkeleton = () => (
  <div className="flex flex-col gap-[11px] animate-pulse">
    <div className="flex gap-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-[62px] rounded-[10px] bg-muted border border-border"
        />
      ))}
    </div>
    <div className="h-9 rounded-[7px] bg-muted border border-border" />
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-[108px] rounded-xl bg-muted border border-border"
      />
    ))}
  </div>
);
