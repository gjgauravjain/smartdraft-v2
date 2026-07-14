export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-bold text-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}
