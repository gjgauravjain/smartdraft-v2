export function MobileInfoItem({
  label,
  value,
  bordered = false,
}: {
  label: string;
  value: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex-1 text-center ${
        bordered ? "border-l border-border" : ""
      }`}
    >
      <div className="truncate px-2 text-[13px] font-bold text-foreground">
        {value}
      </div>

      <div className="mt-0.5 text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-muted-foreground">
        {label}
      </div>

      <div className="mt-[3px] text-[13px] font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}
