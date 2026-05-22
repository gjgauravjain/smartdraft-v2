'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface PrivateRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Generate breadcrumbs from pathname
 */
function generateBreadcrumbs(pathname: string): Array<{ label: string; href?: string }> {
  const paths = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: Array<{ label: string; href?: string }> = [
    { label: 'Home', href: '/dashboard' },
  ];

  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    
    // Format the path name (e.g., "player-database" -> "Player Database")
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Last item should not have href (current page)
    if (index === paths.length - 1) {
      breadcrumbs.push({ label, href: undefined });
    } else {
      breadcrumbs.push({ label, href: currentPath });
    }
  });

  return breadcrumbs;
}

/**
 * PrivateRoute Component
 * Protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Automatically wraps children with DashboardLayout.
 */
export function PrivateRoute({ children, fallback }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  // Show loading state
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

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Generate breadcrumbs from current pathname
  const breadcrumbs = generateBreadcrumbs(pathname);

  // User is authenticated, render children wrapped in DashboardLayout
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {children}
    </DashboardLayout>
  );
}
