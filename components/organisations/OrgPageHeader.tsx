import { Menu, PlusIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "../ui/sidebar";

type OrgPageHeaderProps = {
  onManageUsers: () => void;
  onNewOrganisation: () => void;
  isLoading: boolean;
};

export const OrgPageHeader = ({
  onManageUsers,
  onNewOrganisation,
  isLoading,
}: OrgPageHeaderProps) => {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <div className="bg-background border-b border-border h-12 flex items-center px-3.5 gap-2.5 flex-shrink-0">
        <button
          aria-label="Open menu"
          className="w-8 h-8 flex items-center justify-center text-foreground bg-transparent border-none cursor-pointer"
        >
          <Menu
            size={20}
            onClick={() => {
              setOpenMobile(true);
            }}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-foreground truncate">
            Organisations
          </p>
        </div>

        <Button
          aria-label="New organisation"
          onClick={onNewOrganisation}
          disabled={isLoading}
          className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg border-none cursor-pointer disabled:opacity-50"
        >
          <PlusIcon size={20} strokeWidth={1.8} aria-hidden />
        </Button>
      </div>
    );
  }
  return (
    <div className="bg-card border-b border-border px-5 py-3 flex items-center gap-3 shrink-0">
      <div className="min-w-0">
        <h1 className="text-[17px] font-bold text-foreground tracking-[-0.2px]">
          Organisations
        </h1>
        <p className="text-[11.5px] text-muted-foreground mt-px">
          {isLoading ? "Loading..." : "SmartDraft platform · all organisations"}
        </p>
      </div>
      <span className="flex-1" />

      <Button onClick={onManageUsers} variant="outline">
        <UserIcon size={13} />
        Manage users
      </Button>

      <Button onClick={onNewOrganisation}>
        <PlusIcon size={13} />
        New organisation
      </Button>
    </div>
  );
};
