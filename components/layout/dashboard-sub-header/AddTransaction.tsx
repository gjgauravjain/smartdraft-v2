"use client";

import { TRANSACTION_MENU_OPTIONS } from "./util";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionMenuValue } from "./type";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { BottomSheet } from "@/components/common/BottomSheet";
import { BottomSheetOption } from "@/components/common/BottomSheetOption";

type AddTransactionProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleMenuSelect: (value: TransactionMenuValue) => void;
};

const AddTransaction = ({
  menuOpen,
  setMenuOpen,
  handleMenuSelect,
}: AddTransactionProps) => {
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button
      size={isMobile ? "icon" : "sm"}
      onClick={isMobile ? () => setMenuOpen(true) : undefined}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90",
        isMobile
          ? "fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          : "h-8 gap-1.5",
      )}
    >
      <Plus className={isMobile ? "h-6 w-6" : "h-4 w-4"} />
      {!isMobile && "New transaction"}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <BottomSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          title="New transaction"
        >
          <div className="flex flex-col gap-1.5 px-3 py-2.5">
            {TRANSACTION_MENU_OPTIONS.map((option) => (
              <BottomSheetOption
                key={option.id}
                label={option.label}
                icon={option.icon}
                onClick={() => {
                  handleMenuSelect(option.value);
                  setMenuOpen(false);
                }}
              />
            ))}
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1">
        <div className="flex flex-col">
          {TRANSACTION_MENU_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleMenuSelect(option.value)}
              className="rounded-md px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddTransaction;
