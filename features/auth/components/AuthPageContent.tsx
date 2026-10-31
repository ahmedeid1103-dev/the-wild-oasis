import "server-only";

import { redirect } from "next/navigation";

import AuthForm from "./AuthForm";
import { getCurrentUser } from "@/lib/auth/current-user";
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
  const { user } = await getCurrentUser();

  if (user) {
    redirect(destination);
  }

  return <AuthForm mode={mode} next={destination} />;
}
