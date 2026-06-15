"use client";

import { useAuth0 } from "@auth0/auth0-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useAuth, useStore } from "@/store/useStore";
import { setApiAccessToken } from "@/lib/api-client";
import { useGetUserDetails } from "@/app/api/react-query/common";
import { Toaster } from "sonner";

interface AuthManagerProps {
  children: ReactNode;
}

type AuthContextType = {
  getAccessToken: (refreshToken?: boolean) => Promise<void>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  getAccessToken: async () => {},
  logoutUser: () => {},
});

declare global {
  interface Window {
    __getAccessToken?: () => Promise<void>;
    __logoutUser?: () => void;
  }
}

export function AuthManager({ children }: AuthManagerProps) {
  const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const { accessToken, setAccessToken, setUser, clearAuth } = useAuth();
  const setCurrentProject = useStore((state) => state.setCurrentProject);
  const { data: userDetails } = useGetUserDetails();

  const getToken = useCallback(
    async (refreshToken?: boolean) => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
        setApiAccessToken(token);

        if (refreshToken) {
          setCurrentProject("");
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    },
    [getAccessTokenSilently, setAccessToken, setCurrentProject],
  );

  const logoutUser = useCallback(() => {
    setCurrentProject("");
    clearAuth();
    setApiAccessToken(null);
    logout({
      logoutParams: {
        returnTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  }, [clearAuth, logout, setCurrentProject]);

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      getToken();
    }
  }, [isAuthenticated, accessToken, getToken]);

  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
    }
  }, [accessToken, setUser, userDetails]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__getAccessToken = () => getToken(true);
      window.__logoutUser = logoutUser;
    }
  }, [getToken, logoutUser]);

  return (
    <AuthContext.Provider
      value={{
        getAccessToken: getToken,
        logoutUser,
      }}
    >
      <button
        style={{ position: "absolute", visibility: "hidden" }}
        id="getToken"
        onClick={logoutUser}
      >
        Get Token
      </button>
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
}

export const AuthContexts = () => useContext(AuthContext);
