import { BidMatchResult } from "./type";

type BidMatchHeadlineProps = {
  result: BidMatchResult;
};

export const BidMatchHeadline = ({ result }: BidMatchHeadlineProps) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">
          {result.headline}
        </h3>
        {result.basis ? (
          <p className="mt-1 text-xs text-muted-foreground">{result.basis}</p>
        ) : null}
      </div>
      {result.spots ? (
        <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
          {result.spots}
        </span>
      ) : null}
    </div>
  );
};
