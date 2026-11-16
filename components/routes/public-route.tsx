'use client';

import { LoginLoadingState } from '@/components/login/login-loading-state';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * PublicRoute Component
 * For pages that should only be accessible to non-authenticated users (e.g., login page).
 * Redirects authenticated users to the specified route (default: /dashboard).
 */
export function PublicRoute({ 
  children, 
  redirectTo = '/dashboard',
  fallback 
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return fallback || <LoginLoadingState />;
  }

  // If authenticated, show nothing (will redirect)
  if (isAuthenticated) {
    return null;
  }

  // User is not authenticated, render children
  return <>{children}</>;
}
