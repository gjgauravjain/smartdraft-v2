'use client';

import { useAuth0 } from '@auth0/auth0-react';

export function useHomeWizard() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();

  const handleGetStarted = () => {
    loginWithRedirect();
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    handleGetStarted,
  };
}
