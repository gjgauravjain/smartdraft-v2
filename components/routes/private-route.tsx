"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, ReactNode } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";

interface PrivateRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PrivateRoute({ children, fallback }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
