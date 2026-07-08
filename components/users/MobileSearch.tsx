export const MobileSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  return (
    <div className="relative mb-2.5">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search users…"
        className="w-full py-2.5 pl-[34px] pr-3 text-[13px] border border-border rounded-[9px] bg-input text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
      />
      <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-muted-foreground flex pointer-events-none">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
    </div>
  );
};
