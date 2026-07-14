import { TRANSACTION_MENU_OPTIONS } from "./util";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionMenuValue } from "./type";

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
  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New transaction
        </Button>
      </PopoverTrigger>
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
