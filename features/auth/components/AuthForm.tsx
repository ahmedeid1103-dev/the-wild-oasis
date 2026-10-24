"use client";

import Link from "next/link";
import { useActionState } from "react";

import LoadingIndicator from "@/components/LoadingIndicator";
import { signInAction, signUpAction } from "@/features/auth/actions";
import type { ActionState } from "@/lib/action-state";

type AuthFormProps = {
  mode: "login" | "signup";
  next: string;
};

const initialState: ActionState = {};

export default function AuthForm({ mode, next }: AuthFormProps) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <div className="ui-card w-full max-w-md p-5 backdrop-blur sm:p-8">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next} />

        <label className="ui-field">
          <span className="ui-field__label">Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            className="ui-input"
          />
        </label>

        <label className="ui-field">
          <span className="ui-field__label">Password</span>
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={isSignup ? 8 : undefined}
            maxLength={128}
            required
            className="ui-input"
          />
        </label>

        {state.error && (
          <p role="alert" className="ui-notice ui-notice--error text-sm">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="ui-notice ui-notice--success text-sm">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="ui-button ui-button--primary w-full"
        >
          {pending ? (
            <LoadingIndicator
              label={isSignup ? "Creating account..." : "Signing in..."}
            />
          ) : isSignup ? (
            "Create account"
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-primary-300">
        {isSignup ? "Already have an account?" : "New to The Wild Oasis?"}{" "}
        <Link
          href={`${isSignup ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`}
          className="ui-link"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
      {isSignup && (
        <p className="mt-3 text-xs leading-5 text-primary-400">
          You may need to confirm your email address before you can sign in.
        </p>
      )}
    </div>
  );
}
