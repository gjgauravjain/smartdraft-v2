type BidMatchCompensationProps = {
  compensation: string;
};

export const BidMatchCompensation = ({
  compensation,
}: BidMatchCompensationProps) => {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      {compensation}
    </p>
  );
};
