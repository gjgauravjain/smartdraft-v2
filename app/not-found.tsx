"use client";

import { LoginLoadingState } from "@/components/login/login-loading-state";
import { buildLoginUrl } from "@/components/login/util";
import { useAuth0 } from "@auth0/auth0-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NotFound = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    const returnTo = pathname || "/";
    window.location.replace(buildLoginUrl(returnTo));
  }, [pathname, isAuthenticated, isLoading]);

  if (isLoading || !isAuthenticated) {
    return <LoginLoadingState />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <p className="text-muted-foreground">Page not found</p>
    </main>
  );
};

export default NotFound;
