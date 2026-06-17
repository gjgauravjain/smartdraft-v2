"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutPanelLeft, User, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Draft", icon: LayoutPanelLeft, href: "/draft" },
  { label: "Player", icon: User, href: "/player" },
  { label: "List", icon: ClipboardList, href: "/list" },
  { label: "Account", icon: User, href: "/account" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      aria-label="Main navigation"
      className="flex items-start fixed w-full bottom-0 justify-around flex-shrink-0 border-t border-border bg-background"
      style={{ height: 56, padding: "8px 6px 18px" }}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active =
          pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <button
            key={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            onClick={() => router.push(href)}
            className={cn(
              "flex flex-col items-center gap-0.75 flex-1 bg-transparent border-none cursor-pointer transition-colors duration-150",
              active
                ? "dark:text-accent text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={20} strokeWidth={1.8} aria-hidden />
            <span className="text-[10px] font-medium font-sans">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
