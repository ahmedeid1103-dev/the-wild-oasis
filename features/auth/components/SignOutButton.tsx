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
        className="ui-button ui-button--ghost w-full justify-start px-5"
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
