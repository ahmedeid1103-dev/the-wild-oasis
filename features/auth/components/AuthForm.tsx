"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSignup = mode === "signup";

  return (
    <div className="ui-card w-full max-w-md p-5 backdrop-blur sm:p-8">
      <form action={formAction} className="space-y-5" noValidate>
        <input type="hidden" name="next" value={next} />

        <div className="ui-field">
          <label htmlFor="auth-email" className="ui-field__label">
            Email address
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            className="ui-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={
              state.fieldErrors?.email ? "auth-email-error" : undefined
            }
          />
          {state.fieldErrors?.email && (
            <p
              id="auth-email-error"
              role="alert"
              className="mt-2 text-sm text-red-300"
            >
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div className="ui-field">
          <label htmlFor="auth-password" className="ui-field__label">
            Password
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={isSignup ? 8 : undefined}
            maxLength={128}
            required
            className="ui-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={
              state.fieldErrors?.password ? "auth-password-error" : undefined
            }
          />
          {state.fieldErrors?.password && (
            <p
              id="auth-password-error"
              role="alert"
              className="mt-2 text-sm text-red-300"
            >
              {state.fieldErrors.password}
            </p>
          )}
        </div>

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
