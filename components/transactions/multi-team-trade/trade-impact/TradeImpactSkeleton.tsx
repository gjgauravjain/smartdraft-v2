import { Skeleton } from "@/components/ui/skeleton";

export const TradeImpactSkeleton = () => (
  <div className="flex flex-col gap-3.5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-[22px] w-[22px] rounded-full bg-muted" />
      <Skeleton className="h-3 w-[90px] rounded-md bg-muted" />
      <Skeleton className="h-2.5 flex-1 rounded-full bg-muted" />
      <Skeleton className="h-3 w-[90px] rounded-md bg-muted" />
      <Skeleton className="h-[22px] w-[22px] rounded-full bg-muted" />
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-[18px] w-[150px] rounded-md bg-muted" />
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-2.5 w-[110px] rounded-md bg-muted" />
    </div>
    <div className="flex justify-center gap-2">
      <Skeleton className="h-[26px] w-[84px] rounded-full bg-muted" />
      <Skeleton className="h-[26px] w-[240px] rounded-full bg-muted" />
    </div>
  </div>
);
