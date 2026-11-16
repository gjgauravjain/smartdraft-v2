export const RETURN_TO_PARAM = "returnTo";

const DEFAULT_RETURN_PATH = "/dashboard";

export const normalizeReturnTo = (returnTo: string | null): string => {
  if (!returnTo || !returnTo.startsWith("/")) {
    return DEFAULT_RETURN_PATH;
  }

  if (returnTo === "/") {
    return DEFAULT_RETURN_PATH;
  }

  return returnTo;
};

export const buildLoginUrl = (returnTo: string): string => {
  const params = new URLSearchParams();
  params.set(RETURN_TO_PARAM, returnTo);
  return `/?${params.toString()}`;
};

export const hasAuthErrorInSearchParams = (
  searchParams: URLSearchParams,
): boolean => {
  return searchParams.has("error");
};

export const stripAuthErrorSearchParams = (
  searchParams: URLSearchParams,
): string => {
  const next = new URLSearchParams(searchParams);
  next.delete("error");
  next.delete("error_description");
  next.delete("state");
  const query = next.toString();
  if (!query) {
    return "/";
  }
  return `/?${query}`;
};
