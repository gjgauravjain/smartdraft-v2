const Bone = ({ className }: { className: string }) => (
  <div className={`rounded-[5px] bg-muted animate-pulse ${className}`} />
);

const SkeletonRow = ({ isLast }: { isLast?: boolean }) => (
  <div
    className={`grid items-center gap-3.5 px-3.5 py-3.25 ${
      isLast ? "" : "border-b border-border/60"
    }`}
    style={{ gridTemplateColumns: "2.4fr 1fr 1.4fr 0.7fr 1fr 0.4fr" }}
  >
    {/* Name col — avatar + text */}
    <div className="flex items-center gap-2.5">
      <Bone className="w-8.5 h-8.5 rounded-lg shrink-0" />
      <Bone className="h-3 w-[70%]" />
    </div>
    {/* Sporting code */}
    <Bone className="h-4.5 w-12 rounded" />
    {/* Default team */}
    <Bone className="h-2.75 w-[80%]" />
    {/* Members */}
    <Bone className="h-3 w-6" />
    {/* Created */}
    <Bone className="h-2.75 w-[70%]" />
    {/* Actions */}
    <Bone className="h-4 w-4 rounded" />
  </div>
);

type OrgTableSkeletonProps = {
  rows?: number;
};

export const OrgTableSkeleton = ({ rows = 6 }: OrgTableSkeletonProps) => (
  <>
    {/* Toolbar skeleton */}
    <div className="flex items-center gap-2 mb-3.5">
      <Bone className="w-75 h-9 rounded-[7px]" />
      <span className="flex-1" />
      <Bone className="w-27.5 h-8 rounded-md" />
      <Bone className="w-27.5 h-8 rounded-md" />
    </div>

    {/* Table skeleton */}
    <div className="sd-table-wrap">
      {/* Fake thead */}
      <div
        className="px-3.5 py-3 border-b border-border"
        style={{ background: "var(--table-header)" }}
      >
        <Bone className="w-36 h-2.5" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} isLast={i === rows - 1} />
      ))}
    </div>
  </>
);
