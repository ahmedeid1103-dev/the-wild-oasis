"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useActionState } from "react";

import LoadingIndicator from "@/components/LoadingIndicator";
import { signOutAction } from "@/features/auth/actions";
import type { ActionState } from "@/lib/action-state";

const initialState: ActionState = {};

export default function SignOutButton() {
  const [state, formAction, pending] = useActionState(signOutAction, initialState);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="flex w-full items-center gap-4 px-5 py-3 font-semibold text-primary-200 transition-colors hover:bg-primary-900 hover:text-primary-100 disabled:cursor-wait disabled:opacity-60"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5 text-primary-600" />

        {pending ? (
          <LoadingIndicator label="Signing out..." />
        ) : (
          <span>Sign out</span>
        )}
      </button>
      {state.error && (
        <p role="alert" className="px-5 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
    </form>
  );
}
