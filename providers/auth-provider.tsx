'use client';

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_HOST } from '@/lib/api-constant';
import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface Auth0ProviderWrapperProps {
  children: ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  const router = useRouter();

  const domain = AUTH0_DOMAIN;
  const clientId = AUTH0_CLIENT_ID;

  const onRedirectCallback = (appState?: any) => {
    router.push(appState?.returnTo || '/dashboard');
  };

  if (!domain || !clientId) {
    console.error('Auth0 environment variables are not set');
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: AUTH0_HOST,
        audience: AUTH0_AUDIENCE,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
