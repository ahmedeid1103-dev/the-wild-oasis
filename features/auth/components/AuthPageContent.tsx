import "server-only";

import { redirect } from "next/navigation";

import AuthForm from "./AuthForm";
import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeLocalRedirect } from "../safe-local-redirect";

type AuthPageContentProps = {
  mode: "login" | "signup";
  searchParams: Promise<{ next?: string | string[] | undefined }>;
};

export default async function AuthPageContent({
  mode,
  searchParams,
}: AuthPageContentProps) {
  const { next } = await searchParams;
  const destination = safeLocalRedirect(next);
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && isUnauthenticatedAuthError(error)) {
    return <AuthForm mode={mode} next={destination} />;
  }

  if (error) {
    throw error;
  }

  if (user) {
    redirect(destination);
  }

  return <AuthForm mode={mode} next={destination} />;
}
