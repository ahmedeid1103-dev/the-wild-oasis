import { isAuthApiError } from "@supabase/supabase-js";

export function isUnauthenticatedAuthError(error: unknown): boolean {
  if (
    error instanceof Error &&
    (error.name === "AuthSessionMissingError" ||
      error.name === "AuthUserMissingError")
  ) {
    return true;
  }

  return isAuthApiError(error) && (error.status === 401 || error.status === 403);
}
