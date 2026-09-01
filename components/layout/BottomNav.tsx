"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutPanelLeft, User, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Draft", icon: LayoutPanelLeft, href: "/draftpick" },
  { label: "Player", icon: User, href: "/player" },
  { label: "List", icon: ClipboardList, href: "/list" },
  { label: "Account", icon: User, href: "/org-admin" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      aria-label="Main navigation"
      className="z-50 flex w-full shrink-0 items-start justify-around border-t border-border bg-background pt-2 px-1.5 pb-[max(18px,env(safe-area-inset-bottom,0px))]"
      style={{ minHeight: 56 }}
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
                ? "text-highlight-text  "
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
