"use client";

import { LoginContent } from "@/components/login/login-content";
import { LoginLoadingState } from "@/components/login/login-loading-state";
import { useAuthenticatedHomeRedirect } from "@/components/login/use-authenticated-home-redirect";
import { Suspense } from "react";

export default function Home() {
  const { showLoading } = useAuthenticatedHomeRedirect();

  if (showLoading) {
    return <LoginLoadingState />;
  }

  return (
    <Suspense fallback={<LoginLoadingState />}>
      <LoginContent />
    </Suspense>
  );
}