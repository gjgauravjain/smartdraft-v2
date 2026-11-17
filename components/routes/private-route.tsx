"use client";

import { LoginLoadingState } from "@/components/login/login-loading-state";
import { buildLoginUrl } from "@/components/login/util";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";

interface PrivateRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PrivateRoute({ children, fallback }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    const returnTo = `${window.location.pathname}${window.location.search}`;
    router.replace(buildLoginUrl(returnTo));
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return fallback || <LoginLoadingState />;
  }

  if (!isAuthenticated) {
    return <LoginLoadingState />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
