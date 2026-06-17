import { ArrowLeft, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileOrganisationHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export function MobileOrganisationHeader({
  title,
  onBack,
  onEdit,
  onDeactivate,
}: MobileOrganisationHeaderProps) {
  return (
    <header className="flex h-12 items-center gap-2 border-b border-border bg-card px-3.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="h-8 w-8 shrink-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-bold text-foreground">
          {title}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDeactivate}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
