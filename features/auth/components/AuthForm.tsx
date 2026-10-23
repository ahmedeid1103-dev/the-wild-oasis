"use client";

import Link from "next/link";
import { useActionState } from "react";

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
    <div className="w-full max-w-md border border-primary-800 bg-primary-950 p-6 sm:p-8">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next} />

        <label className="block text-sm font-medium text-primary-300">
          <span className="mb-2 block">Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            className="w-full border border-primary-700 bg-primary-900 px-4 py-3 text-primary-100 outline-none transition-colors focus:border-accent-500"
          />
        </label>

        <label className="block text-sm font-medium text-primary-300">
          <span className="mb-2 block">Password</span>
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={isSignup ? 8 : undefined}
            maxLength={128}
            required
            className="w-full border border-primary-700 bg-primary-900 px-4 py-3 text-primary-100 outline-none transition-colors focus:border-accent-500"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-300">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="text-sm text-accent-300">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-accent-500 px-5 py-3 font-semibold text-primary-900 transition-colors hover:bg-accent-600 disabled:cursor-wait disabled:opacity-60"
        >
          {pending
            ? "Please wait..."
            : isSignup
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-primary-300">
        {isSignup ? "Already have an account?" : "New to The Wild Oasis?"}{" "}
        <Link
          href={`${isSignup ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`}
          className="text-accent-400 underline underline-offset-4 hover:text-accent-300"
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
