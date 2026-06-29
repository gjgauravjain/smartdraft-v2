const Bone = ({ className }: { className: string }) => (
  <div className={`rounded-[5px] bg-muted animate-pulse ${className}`} />
);

const SkeletonPickRow = ({ isLast }: { isLast?: boolean }) => (
  <div
    className={`grid grid-cols-[2.75rem_5.5rem_minmax(0,1fr)] items-center px-3 py-1.75 ${
      isLast ? "" : "border-b border-border/70"
    }`}
  >
    <Bone className="h-3 w-4" />
    <div className="flex items-center gap-2">
      <Bone className="h-6 w-6 rounded-full shrink-0" />
      <Bone className="h-3 w-10" />
    </div>
    <Bone className="h-5 w-14 ml-auto rounded-full" />
  </div>
);

const SkeletonColumn = ({ rows = 8 }: { rows?: number }) => (
  <section className="flex h-[calc(100vh-178px)] w-60 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
      <div className="space-y-1.5">
        <Bone className="h-3 w-16" />
        <Bone className="h-2 w-12" />
      </div>
      <Bone className="h-8 w-8 rounded-md" />
    </div>
    <div className="grid grid-cols-[2.75rem_5.5rem_minmax(0,1fr)] items-center border-b border-border bg-muted/40 px-3 py-1.25">
      <Bone className="h-2 w-3" />
      <Bone className="h-2 w-8" />
      <Bone className="h-2 w-16 ml-auto" />
    </div>
    <div className="min-h-0 flex-1 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonPickRow key={i} isLast={i === rows - 1} />
      ))}
    </div>
  </section>
);

const SkeletonMobileRound = ({ rows = 5 }: { rows?: number }) => (
  <div className="mt-4 overflow-hidden rounded-[10px] border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
      <Bone className="h-3.5 w-20" />
      <Bone className="h-2.5 w-14" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className={`flex items-center gap-2 px-3.5 py-2.5 ${
          i < rows - 1 ? "border-b border-border/60" : ""
        }`}
      >
        <Bone className="h-3.5 w-5 shrink-0" />
        <Bone className="h-6 w-6 rounded-full shrink-0" />
        <Bone className="h-3 w-16" />
        <Bone className="h-5 w-12 ml-auto rounded-full" />
      </div>
    ))}
  </div>
);

type DraftPicksSkeletonProps = {
  isMobile?: boolean;
  columns?: number;
};

export const DraftPicksSkeleton = ({
  isMobile = false,
  columns = 6,
}: DraftPicksSkeletonProps) => {
  if (isMobile) {
    return (
      <div className="px-4 pb-24">
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-border px-3.5 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-8 w-20 shrink-0 rounded-md" />
          ))}
        </div>
        <SkeletonMobileRound rows={6} />
        <SkeletonMobileRound rows={4} />
      </div>
    );
  }

  return (
    <>
      <div className="flex border-t justify-between bg-card gap-2 px-2 pt-1">
        <div className="flex items-center gap-6 px-4 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="h-4 w-24" />
          ))}
        </div>
        <Bone className="h-8 w-36 rounded-md my-1" />
      </div>
      <div className="w-full overflow-x-auto bg-background p-4">
        <div className="flex min-w-max gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonColumn key={i} rows={i >= 4 ? 4 : 8} />
          ))}
        </div>
      </div>
    </>
  );
};
