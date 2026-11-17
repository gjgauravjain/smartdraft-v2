"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  hasAuthErrorInSearchParams,
  normalizeReturnTo,
  stripAuthErrorSearchParams,
} from "./util";

export const useLoginWizard = () => {
  const searchParams = useSearchParams();
  const { loginWithRedirect, error } = useAuth0();
  const [loginFailed, setLoginFailed] = useState(false);

  const returnTo = normalizeReturnTo(searchParams.get("returnTo"));

  useEffect(() => {
    if (!hasAuthErrorInSearchParams(searchParams)) {
      return;
    }

    setLoginFailed(true);
    const cleanPath = stripAuthErrorSearchParams(searchParams);
    window.history.replaceState({}, "", cleanPath);
  }, [searchParams]);

  useEffect(() => {
    if (!error) {
      return;
    }

    setLoginFailed(true);
  }, [error]);

  const handleLogin = useCallback(() => {
    setLoginFailed(false);
    loginWithRedirect({
      appState: { returnTo },
    });
  }, [loginWithRedirect, returnTo]);

  return {
    loginFailed,
    handleLogin,
  };
};
