import { GoOrganization } from "react-icons/go";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

type OrgEmptyStateProps = {
  onCreateFirst: () => void;
};

export const OrgEmptyState = ({ onCreateFirst }: OrgEmptyStateProps) => (
  <div className="flex h-full items-center justify-center flex-1 w-full">
    <div className="text-center max-w-95">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border text-primary flex items-center justify-center mx-auto mb-4.5">
        <GoOrganization size={28} />
      </div>

      <p className="text-[18px] font-bold text-foreground">
        No organisations yet
      </p>

      <p className="text-[13.5px] text-muted-foreground mt-1.75 leading-relaxed">
        Create the first one to get the platform started. You can add users and
        link them once it exists.
      </p>

      <div className="mt-4.5 flex justify-center">
        <Button
          onClick={onCreateFirst}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer border-0"
        >
          <PlusIcon />
          Create the first organisation
        </Button>
      </div>
    </div>
  </div>
);
