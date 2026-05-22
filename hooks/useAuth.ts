'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to protect routes that require authentication
 * 
 * @param redirectTo - Optional path to redirect to after login
 * @returns Object with authentication state and redirect function
 */
export function useProtectedRoute(redirectTo?: string) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: redirectTo || window.location.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    redirectToLogin: () =>
      loginWithRedirect({
        appState: { returnTo: redirectTo || window.location.pathname },
      }),
  };
}

/**
 * Hook to redirect authenticated users away from public-only pages
 * (e.g., login page)
 * 
 * @param redirectTo - Path to redirect authenticated users to (default: '/')
 */
export function usePublicRoute(redirectTo: string = '/') {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return { isLoading };
}
