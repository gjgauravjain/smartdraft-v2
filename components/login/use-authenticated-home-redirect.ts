"use client";

import { routeUrl } from "@/lib/route-url";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useEffect, useState } from "react";

export const useAuthenticatedHomeRedirect = () => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } =
    useAuth0();
  const router = useRouter();
  const [pendingSessionCheck, setPendingSessionCheck] = useState(true);

  const hasAuth0User = isAuthenticated || Boolean(user);

  useLayoutEffect(() => {
    if (isLoading) {
      return;
    }

    if (!hasAuth0User) {
      return;
    }

    router.replace(routeUrl.draftPick);
  }, [hasAuth0User, isLoading, router]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (hasAuth0User) {
      setPendingSessionCheck(false);
      return;
    }

    let cancelled = false;

    getAccessTokenSilently()
      .then(() => {
        if (cancelled) {
          return;
        }
        router.replace(routeUrl.draftPick);
      })
      .catch(() => {
        // No active Auth0 session — show the login page.
      })
      .finally(() => {
        if (!cancelled) {
          setPendingSessionCheck(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [getAccessTokenSilently, hasAuth0User, isLoading, router]);

  const showLoading = isLoading || hasAuth0User || pendingSessionCheck;

  return { showLoading };
};
