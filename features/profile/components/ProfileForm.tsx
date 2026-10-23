"use client";

import { useActionState } from "react";

import { saveProfileAction } from "@/features/profile/actions";
import type { ActionState } from "@/lib/action-state";
import type { GuestProfile } from "../schemas";

type ProfileFormProps = {
  email?: string;
  profile?: GuestProfile;
};

const initialState: ActionState = {};
const inputClassName =
  "w-full border border-primary-700 bg-primary-900 px-4 py-3 text-primary-100 outline-none transition-colors focus:border-accent-500";

export default function ProfileForm({ email, profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveProfileAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="max-w-2xl space-y-5 border border-primary-800 bg-primary-950 p-6 sm:p-8"
    >
      {email ? (
        <div className="text-sm text-primary-300">
          <p className="mb-1 font-medium">Email address</p>
          <p className="text-primary-100">{email}</p>
          <p className="mt-1 text-primary-400">
            Your email is managed by your sign-in account.
          </p>
        </div>
      ) : (
        <p className="text-sm text-primary-300">
          Your email address will come from your authenticated sign-in account.
        </p>
      )}

      <label className="block text-sm font-medium text-primary-300">
        <span className="mb-2 block">Full name</span>
        <input
          name="fullName"
          type="text"
          autoComplete="name"
          maxLength={150}
          defaultValue={profile?.fullName}
          required
          className={inputClassName}
        />
      </label>

      <label className="block text-sm font-medium text-primary-300">
        <span className="mb-2 block">Nationality</span>
        <input
          name="nationality"
          type="text"
          autoComplete="country-name"
          maxLength={100}
          defaultValue={profile?.nationality}
          required
          className={inputClassName}
        />
      </label>

      <label className="block text-sm font-medium text-primary-300">
        <span className="mb-2 block">National ID</span>
        <input
          name="nationalID"
          type="text"
          maxLength={100}
          defaultValue={profile?.nationalID}
          required
          className={inputClassName}
        />
      </label>

      <label className="block text-sm font-medium text-primary-300">
        <span className="mb-2 block">Country flag</span>
        <input
          name="countryFlag"
          type="text"
          maxLength={16}
          defaultValue={profile?.countryFlag}
          required
          className={inputClassName}
        />
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-accent-500 px-5 py-3 font-semibold text-primary-900 transition-colors hover:bg-accent-600 disabled:cursor-wait disabled:opacity-60"
      >
        {pending
          ? "Saving..."
          : profile
            ? "Save profile changes"
            : "Create profile"}
      </button>
    </form>
  );
}
