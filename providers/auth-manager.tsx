'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, ReactNode } from 'react';
import { useAuth, User, useStore } from '@/store/useStore';

interface AuthManagerProps {
  children: ReactNode;
}

export function AuthManager({ children }: AuthManagerProps) {
  const { isAuthenticated, getAccessTokenSilently, logout, user } = useAuth0();
  const { accessToken, setAccessToken, setUser, clearAuth } = useAuth();
  const setCurrentProject = useStore((state) => state.setCurrentProject);

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      getToken();
    }
  }, [isAuthenticated, accessToken]);

  console.log('AuthManager render - isAuthenticated:', user);
  useEffect(() => {
    if (user) {
      setUser(user as User);
    }
  }, [user, setUser]);

  const getToken = async (refreshToken?: boolean) => {
    try {
      const token = await getAccessTokenSilently();
      setAccessToken(token);
      
      if (refreshToken) {
        setCurrentProject('');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  };

  const logoutUser = () => {
    setCurrentProject('');
    clearAuth();
    logout({ 
      logoutParams: { 
        returnTo: typeof window !== 'undefined' ? window.location.origin : '' 
      } 
    });
  };

  // Expose methods via hidden button (matching old implementation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__getAccessToken = () => getToken(true);
      (window as any).__logoutUser = logoutUser;
    }
  }, []);

  return (
    <>
      <button
        style={{ position: 'absolute', visibility: 'hidden' }}
        id="getToken"
        onClick={() => logoutUser()}
      >
        Get Token
      </button>
      {children}
    </>
  );
}
