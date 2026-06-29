import { useIsMobile } from "@/hooks/use-mobile";
import { useStore } from "@/store/useStore";

export const useDashboardLayout = () => {
  const pathname = window.location.pathname;
  const { isSideBarOpen, setIsSideBarOpen } = useStore();

  const isMobile = useIsMobile();

  const hideSubHeader =
    ["/", "/projects"].includes(pathname) ||
    pathname.startsWith("/organisations");
  return {
    isSideBarOpen,
    setIsSideBarOpen,
    isMobile,
    hideSubHeader,
  };
};
