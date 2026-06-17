import { TabOptionType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function MobileTabItem({
  tab,
  active,
  onClick,
}: {
  tab: TabOptionType;
  active: boolean;
  onClick: () => void;
}) {
  const label = tab.label
    .replace(" Draft Picks", "")
    .replace("Full Draft List", "Full List")
    .replace("Draft Assets", "Assets");

  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "outline"}
      size="sm"
      className="shrink-0 whitespace-nowrap rounded-full text-xs font-semibold"
    >
      {label}
    </Button>
  );
}
