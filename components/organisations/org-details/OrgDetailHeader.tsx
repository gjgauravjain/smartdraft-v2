import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileOrganisationHeader } from "./MobileOrgHeader";

interface OrganisationHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export function OrganisationHeader({
  title,
  onBack,
  onEdit,
  onDeactivate,
}: OrganisationHeaderProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileOrganisationHeader
        title={title}
        onBack={onBack}
        onEdit={onEdit}
        onDeactivate={onDeactivate}
      />
    );
  }
  return (
    <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        className="h-8 w-8 shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
          <Pencil className="h-3.5 w-3.5" />
          Edit Settings
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDeactivate}
          className="gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Deactivate
        </Button>
      </div>
    </div>
  );
}
