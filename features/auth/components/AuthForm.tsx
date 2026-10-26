"use client";

import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useActionState, useEffect, useRef, useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const isSignup = mode === "signup";

  useEffect(() => {
    if (state.fieldErrors?.email) {
      emailInputRef.current?.focus();
    } else if (state.fieldErrors?.password) {
      passwordInputRef.current?.focus();
    } else if (state.error) {
      formErrorRef.current?.focus();
    }
  }, [state]);

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
            ref={emailInputRef}
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
          <div className="relative">
            <input
              id="auth-password"
              ref={passwordInputRef}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              maxLength={128}
              required
              className="ui-input pr-12"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.password)}
              aria-describedby={
                state.fieldErrors?.password ? "auth-password-error" : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-primary-300 transition-colors hover:text-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
            >
              {showPassword ? (
                <EyeSlashIcon aria-hidden="true" className="size-5" />
              ) : (
                <EyeIcon aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
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
          <p
            ref={formErrorRef}
            role="alert"
            tabIndex={-1}
            className="ui-notice ui-notice--error text-sm"
          >
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
