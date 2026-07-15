"use client";

import { useState } from "react";
import { ProjectDropdown } from "@/components/layout/dashboard-sub-header/ProjectDropdown";
import { TalentOrderDropdown } from "@/components/layout/dashboard-sub-header/TalentOrderDropdown";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/app/api/type/projects";
import { SearchableDropdownOption } from "../ui/searchable-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSelectionSettings from "./AppSelectionSettings";
import TransactionModalSwitch from "./dashboard-sub-header/TransactionModalSwitch";
import AddTransaction from "./dashboard-sub-header/AddTransaction";
import { TransactionMenuValue } from "./dashboard-sub-header/type";

interface DashboardSubHeaderProps {
  projects?: ProjectType[];
  selectedProject?: ProjectType | null;
  onProjectChange?: (project: ProjectType) => void;
  talentOrder?: string;
  onTalentOrderChange?: (value: string) => void;
  onNewTransaction?: () => void;
  onNewProject?: () => void;
  className?: string;
  talentOrderOptions: SearchableDropdownOption[];
}

export function DashboardSubHeader({
  projects,
  onProjectChange,
  talentOrder,
  onTalentOrderChange,
  onNewTransaction,
  onNewProject,
  className,
  selectedProject,
  talentOrderOptions,
}: DashboardSubHeaderProps) {
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<TransactionMenuValue | null>(
    null,
  );

  const handleProjectChange = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    if (project) {
      onProjectChange?.(project);
    }
  };

  const handleMenuSelect = (value: TransactionMenuValue) => {
    setMenuOpen(false);
    setActiveModal(value);
    onNewTransaction?.();
  };

  const closeModal = () => setActiveModal(null);

  if (isMobile) {
    return (
      <div
        className={cn(
          "flex shrink-0 gap-2  border-b border-b-border bg-card px-3 py-2",
          className,
        )}
      >
        <ProjectDropdown
          value={selectedProject?.id}
          onChange={handleProjectChange}
          projects={projects}
          onNewProject={onNewProject ?? (() => {})}
        />
        <TalentOrderDropdown
          value={talentOrder}
          onChange={onTalentOrderChange}
          options={talentOrderOptions}
        />
        <AddTransaction
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleMenuSelect={handleMenuSelect}
        />
        {activeModal && (
          <TransactionModalSwitch type={activeModal} onClose={closeModal} />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-11 shrink-0 items-center justify-between bg-card",
        className,
      )}
    >
      <AppSelectionSettings />
      <div className="flex items-center gap-2">
        <AddTransaction
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          handleMenuSelect={handleMenuSelect}
        />
      </div>
      {activeModal && (
        <TransactionModalSwitch type={activeModal} onClose={closeModal} />
      )}
    </div>
  );
}
