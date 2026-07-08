const Bone = ({ className }: { className: string }) => (
  <div className={`rounded-[5px] bg-muted animate-pulse ${className}`} />
);

const SkeletonRow = ({ isLast }: { isLast?: boolean }) => (
  <tr className={isLast ? "" : "border-b border-border/60"}>
    <td className="px-3.5 py-[13px]">
      <div className="flex items-center gap-2.5">
        <Bone className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Bone className="h-3 w-28" />
          <Bone className="h-2.5 w-40" />
        </div>
      </div>
    </td>

    <td className="px-3.5 py-[13px]">
      <Bone className="h-[22px] w-20 rounded-[5px]" />
    </td>

    <td className="px-3.5 py-[13px]">
      <div className="flex gap-1.5">
        <Bone className="h-5 w-10 rounded-full" />
        <Bone className="h-5 w-10 rounded-full" />
      </div>
    </td>

    <td className="px-3.5 py-[13px]">
      <Bone className="h-3 w-14" />
    </td>

    <td className="px-3.5 py-[13px]">
      <Bone className="h-4 w-4 rounded ml-auto" />
    </td>
  </tr>
);

type UsersTableSkeletonProps = {
  rows?: number;
};

export const UsersTableSkeleton = ({ rows = 6 }: UsersTableSkeletonProps) => (
  <>
    <div className="flex items-center gap-2 mb-3.5">
      <div className="h-9 w-[300px] rounded-[7px] bg-muted animate-pulse" />
      <span className="flex-1" />
      <div className="h-8 w-[90px] rounded-md bg-muted animate-pulse" />
      <div className="h-8 w-[90px] rounded-md bg-muted animate-pulse" />
      <div className="h-8 w-[90px] rounded-md bg-muted animate-pulse" />
    </div>

    <div className="sd-table-wrap">
      <div
        className="px-3.5 py-3 border-b border-border"
        style={{ background: "var(--table-header)" }}
      >
        <div className="h-2.5 w-32 rounded-[5px] bg-muted animate-pulse" />
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} isLast={i === rows - 1} />
          ))}
        </tbody>
      </table>
    </div>
  </>
);
