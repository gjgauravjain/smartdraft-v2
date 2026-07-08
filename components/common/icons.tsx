import { cn } from "@/lib/utils";

export type IconProps = {
  className?: string;
};

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const DotsIcon = ({ className }: IconProps) => (
  <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export const HomeIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
};

export const DraftHomeIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V10" />
    </svg>
  );
};

export const PicksIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
};

export const ScenarioIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 6h6M9 18h6M6 9v6M18 9v6" />
    </svg>
  );
};

export const TradeIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
};

export const DraftBoardIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
};

export const PlayerIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22a8 8 0 0 1 16 0" />
    </svg>
  );
};

export const OrderIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
};

export const NotesIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
};

export const DatabaseIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
};

export const ListIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  );
};

export const ContractsIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  );
};

export const SettingsIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82 2 2 0 1 1-2.83 2.83 1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51 2 2 0 0 1-4 0 1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33 2 2 0 1 1-2.83-2.83 1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1 2 2 0 0 1 0-4 1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82 2 2 0 1 1 2.83-2.83 1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51 2 2 0 0 1 4 0 1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33 2 2 0 1 1 2.83 2.83 1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1 2 2 0 0 1 0 4h0a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
};

export const BuildingIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  );
};

export const ShieldIcon = ({ className }: IconProps) => {
  return (
    <svg className={cn("size-[17px] shrink-0", className)} {...svgProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
};

export const SD_ICON_COMPONENTS = {
  home: HomeIcon,
  dhome: DraftHomeIcon,
  picks: PicksIcon,
  scenario: ScenarioIcon,
  trade: TradeIcon,
  board: DraftBoardIcon,
  player: PlayerIcon,
  order: OrderIcon,
  notes: NotesIcon,
  database: DatabaseIcon,
  list: ListIcon,
  contracts: ContractsIcon,
  settings: SettingsIcon,
  building: BuildingIcon,
  shield: ShieldIcon,
  projection: ScenarioIcon,
} as const;

export const SD_ICONS = {
  home: <HomeIcon />,
  dhome: <DraftHomeIcon />,
  picks: <PicksIcon />,
  scenario: <ScenarioIcon />,
  trade: <TradeIcon />,
  board: <DraftBoardIcon />,
  player: <PlayerIcon />,
  order: <OrderIcon />,
  notes: <NotesIcon />,
  database: <DatabaseIcon />,
  list: <ListIcon />,
  contracts: <ContractsIcon />,
  settings: <SettingsIcon />,
  building: <BuildingIcon />,
  shield: <ShieldIcon />,
  projection: <ScenarioIcon />,
};
